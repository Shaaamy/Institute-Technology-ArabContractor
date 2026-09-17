// normalizers.js
// ─────────────────────────────────────────────────────────────────────────────
import { fmtDate, toStatusKey } from './helpers';

export function normalizeUser(u) {
    return {
        id: u.id,
        username: u.username ?? u.email ?? '',
        firstName: u.firstName ?? u.first_name ?? (u.username ?? '').split(' ')[0] ?? '',
        lastName: u.lastName ?? u.last_name ?? (u.username ?? '').split(' ').slice(1).join(' ') ?? '',
        email: u.email ?? '',
        enrolledCourses: (u.courses ?? []).map(c => ({
            enrollmentId: c.enrollmentId,
            id: c.planworkId ?? c.PlanworkId ?? c.planwork_id ?? c.courseId ?? c.serviceId ?? null,
            title: c.title ?? c.serviceTitle ?? '—',
            date: fmtDate(c.enrolledAt),
            attended: !!(c.attended),
            certificateUrl: c.certificateUrl ?? null,
            certificateName: c.certificateName ?? null,
            _userId: u.id,
            _titleRaw: c.title ?? c.serviceTitle ?? '',
        })),
    };
}

export function normalizeCourse(c) {
    return {
        id: c.id,
        title: c.serviceTitle ?? c.title ?? '—',
        category: c.category ?? c.type ?? '',
        enrolledUsers: (c.users ?? []).map(u => {
            const parts = (u.username ?? '').trim().split(' ');
            return {
                enrollmentId: u.enrollmentId ?? null,
                id: u.id ?? u.userId ?? null,
                username: u.username ?? u.email ?? '',
                firstName: u.firstName ?? parts[0] ?? '',
                lastName: u.lastName ?? parts.slice(1).join(' ') ?? '',
                email: u.email ?? '',
                date: fmtDate(u.enrolledAt),
                attended: !!(u.attended ?? false),
                certificateUrl: u.certificateUrl ?? null,
                certificateName: u.certificateName ?? null,
            };
        }),
    };
}

export function normalizeRefund(r) {
    return {
        id: r.id ?? r.Id,
        refNumber: r.refNumber ?? r.RefNumber ?? r.ref_number ?? '',
        orderId: r.orderId ?? r.OrderId ?? r.order_id ?? '',
        userId: r.userId ?? r.UserId ?? r.user_id,
        courseId: r.planworkId ?? r.PlanworkId ?? r.planwork_id ?? r.courseId ?? r.CourseId,
        amount: r.amount ?? r.Amount ?? 0,
        currency: r.currency ?? r.Currency ?? 'EGP',
        reason: r.reason ?? r.Reason ?? '',
        details: r.details ?? r.Details ?? r.notes ?? '',
        status: toStatusKey(r.status ?? r.Status ?? 'Pending'),
        bankName: r.bankName ?? r.BankName ?? r.bank_name ?? '',
        accountNumber: r.accountNumber ?? r.AccountNumber ?? r.account_number ?? '',
        accountHolder: r.accountHolder ?? r.AccountHolder ?? r.account_holder ?? '',
        iban: r.iban ?? r.IBAN ?? '',
        adminNote: r.adminNote ?? r.AdminNote ?? '',
        rejectionReason: r.rejectionReason ?? r.RejectionReason ?? '',
        requestedAt: fmtDate(r.requestedAt ?? r.RequestedAt ?? r.createdAt ?? r.CreatedAt),
        approvedAt: fmtDate(r.approvedAt ?? r.ApprovedAt),
        sentAt: fmtDate(r.sentAt ?? r.SentAt),
        rejectedAt: fmtDate(r.rejectedAt ?? r.RejectedAt),
        bankResult: r.bankResult ?? r.BankResult ?? null,
    };
}