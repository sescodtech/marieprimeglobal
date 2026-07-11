import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { STATUS_LABELS } from "@/lib/applicationForms/status";

type Row = Record<string, string | number>;

function toCsv(rows: Row[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (val: string | number) => {
    const s = String(val ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))].join("\n");
}

function toExcelBuffer(rows: Row[], sheetName: string): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

async function buildRows(type: string, from?: Date, to?: Date): Promise<{ rows: Row[]; filename: string }> {
  const dateFilter = from || to ? { gte: from, lte: to } : undefined;

  if (type === "enquiries") {
    const enquiries = await prisma.enquiry.findMany({
      where: dateFilter ? { createdAt: dateFilter } : {},
      orderBy: { createdAt: "desc" },
      include: { assignedStaff: { select: { name: true } } },
    });
    return {
      filename: "enquiries",
      rows: enquiries.map((e) => ({
        Name: e.fullName,
        Email: e.email,
        Phone: e.phone,
        Service: e.serviceInterest,
        Subject: e.subject ?? "",
        Status: e.status,
        Assigned: e.assignedStaff?.name ?? "",
        Submitted: e.createdAt.toISOString(),
      })),
    };
  }

  if (type === "services") {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    return {
      filename: "services",
      rows: services.map((s) => ({
        Title: s.title,
        Slug: s.slug,
        "Application Mode": s.applicationMode,
        Published: s.isPublished ? "Yes" : "No",
        Archived: s.isArchived ? "Yes" : "No",
        "Processing Time": s.processingTime ?? "",
      })),
    };
  }

  if (type === "staff-performance") {
    const staff = await prisma.admin.findMany({
      where: { role: { in: ["ADMIN", "STAFF", "SUPER_ADMIN"] }, status: "ACTIVE" },
      orderBy: { name: "asc" },
    });
    const rows: Row[] = [];
    for (const s of staff) {
      const [assigned, completed, approved, rejected] = await Promise.all([
        prisma.serviceApplication.count({ where: { assignedStaffId: s.id } }),
        prisma.serviceApplication.count({ where: { assignedStaffId: s.id, status: "COMPLETED" } }),
        prisma.serviceApplication.count({ where: { assignedStaffId: s.id, status: "APPROVED" } }),
        prisma.serviceApplication.count({ where: { assignedStaffId: s.id, status: "REJECTED" } }),
      ]);
      rows.push({ Name: s.name, Role: s.role, Assigned: assigned, Completed: completed, Approved: approved, Rejected: rejected });
    }
    return { filename: "staff-performance", rows };
  }

  // default: applications
  const applications = await prisma.serviceApplication.findMany({
    where: dateFilter ? { submittedAt: dateFilter } : {},
    orderBy: { submittedAt: "desc" },
    include: { assignedStaff: { select: { name: true } } },
  });
  return {
    filename: "applications",
    rows: applications.map((a) => ({
      Reference: a.referenceNumber,
      Applicant: a.applicantName,
      Email: a.applicantEmail,
      Phone: a.applicantPhone,
      Service: a.serviceTitle,
      Status: STATUS_LABELS[a.status],
      Assigned: a.assignedStaff?.name ?? "",
      Submitted: a.submittedAt.toISOString(),
    })),
  };
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.EXPORT_REPORTS)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "applications";
  const format = searchParams.get("format") || "csv";
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const from = fromParam ? new Date(fromParam) : undefined;
  const to = toParam ? new Date(toParam) : undefined;

  const { rows, filename } = await buildRows(type, from, to);

  if (format === "xlsx") {
    const buffer = toExcelBuffer(rows, type);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
