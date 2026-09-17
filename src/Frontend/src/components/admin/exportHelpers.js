import { getLogoBase64, triggerDownload } from './helpers';
import { REFUND_STATUS_META } from './constants';

// ════════════════════════════════════════════════════════════════════════════
// Canvas helper — renders Arabic text to a PNG data-URL for jsPDF cells
// ════════════════════════════════════════════════════════════════════════════
export function renderTextToImage(text, {
    fontSize = 12, bold = false, color = '#111111',
    width = 200, height = 30, bgColor = null, align = 'right',
} = {}) {
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, width, height); }
    const fontStack = `${bold ? 'bold ' : ''}${fontSize}px "Cairo","Amiri","Noto Naskh Arabic","Noto Sans Arabic","Noto Kufi Arabic","Tahoma","Arial Unicode MS","Arial",sans-serif`;
    ctx.font = fontStack;
    ctx.direction = 'rtl';
    ctx.textAlign = align === 'center' ? 'center' : align === 'left' ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    const padding = 6;
    let x = align === 'right' ? width - padding : align === 'left' ? padding : width / 2;
    const str = String(text ?? '');
    let finalStr = str;
    const maxW = width - padding * 2;
    if (ctx.measureText(finalStr).width > maxW) {
        let lo = 0, hi = str.length;
        while (lo < hi) {
            const mid = Math.floor((lo + hi + 1) / 2);
            if (ctx.measureText(str.slice(0, mid) + '…').width <= maxW) lo = mid; else hi = mid - 1;
        }
        finalStr = str.slice(0, lo) + '…';
    }
    ctx.fillText(finalStr, x, height / 2);
    return canvas.toDataURL('image/png');
}

// ════════════════════════════════════════════════════════════════════════════
// Excel export
// ════════════════════════════════════════════════════════════════════════════
export async function exportExcel(filename, reportTitle, headers, rows, logoSrc) {
    const reportDate = new Date().toLocaleDateString('ar-EG');
    try {
        const { default: ExcelJS } = await import('exceljs');
        const wb = new ExcelJS.Workbook();
        wb.views = [{ rightToLeft: true }];
        const ws = wb.addWorksheet('التقرير', { views: [{ rightToLeft: true }] });
        ws.columns = headers.map((h, i) => ({
            width: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 50),
        }));
        const logoB64 = await getLogoBase64(logoSrc);
        if (logoB64) {
            const imgId = wb.addImage({ base64: logoB64.split(',')[1], extension: 'png' });
            ws.addImage(imgId, { tl: { col: 0, row: 0 }, br: { col: 2, row: 5 } });
        }
        ws.mergeCells(1, 1, 2, headers.length);
        const titleCell = ws.getCell('A1');
        titleCell.value = reportTitle;
        titleCell.font = { bold: true, size: 18, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' };
        ws.getRow(1).height = 42; ws.getRow(2).height = 10;
        ws.mergeCells(3, 1, 3, headers.length);
        const dateCell = ws.getCell('A3');
        dateCell.value = `تاريخ التقرير: ${reportDate}`;
        dateCell.font = { italic: true, size: 10, color: { argb: 'FF555555' } };
        dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
        dateCell.alignment = { horizontal: 'center', readingOrder: 'rightToLeft' };
        ws.getRow(3).height = 20;
        const hRow = ws.addRow(headers);
        hRow.height = 28;
        hRow.eachCell(cell => {
            cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0865A8' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle', readingOrder: 'rightToLeft' };
            cell.border = { bottom: { style: 'medium', color: { argb: 'FFF57C00' } } };
        });
        rows.forEach((row, ri) => {
            const dr = ws.addRow(row);
            dr.height = 20;
            const isAlt = ri % 2 !== 0;
            dr.eachCell({ includeEmpty: true }, (cell, cn) => {
                cell.alignment = { horizontal: cn === headers.length ? 'center' : 'right', readingOrder: 'rightToLeft' };
                if (isAlt) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F9FC' } };
                const b = { style: 'thin', color: { argb: 'FFD0D0D0' } };
                cell.border = { top: b, bottom: b, left: b, right: b };
            });
        });
        const buffer = await wb.xlsx.writeBuffer();
        triggerDownload(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename);
        return;
    } catch (_) { /* fallback to SheetJS */ }

    // SheetJS fallback — loaded dynamically too
    const XLSX = await import('xlsx');
    const wsData = [
        [reportTitle, ...Array(headers.length - 1).fill('')],
        [`تاريخ التقرير: ${reportDate}`, ...Array(headers.length - 1).fill('')],
        [],
        headers,
        ...rows,
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(wsData);
    ws2['!cols'] = headers.map((h, i) => ({ wch: Math.min(Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 6, 55) }));
    ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }];
    const wb2 = XLSX.utils.book_new();
    wb2.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(wb2, ws2, 'التقرير');
    XLSX.writeFile(wb2, filename);
}

// ════════════════════════════════════════════════════════════════════════════
// PDF export
// ════════════════════════════════════════════════════════════════════════════
export async function exportPDF(filename, reportTitle, headers, rows, subtitle = '', logoSrc) {
    const logoDataUrl = await getLogoBase64(logoSrc);
    const reportDate = new Date().toLocaleDateString('ar-EG');
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const BLUE = [8, 101, 168];
    const ORANGE = [245, 124, 0];
    const FOOTER = 'المعهد التكنولوجى لهندسة التشييد والإدارة';

    const drawHeader = () => {
        doc.setFillColor(...BLUE); doc.rect(0, 0, pageW, 34, 'F');
        doc.setFillColor(...ORANGE); doc.rect(0, 34, pageW, 2.5, 'F');
        if (logoDataUrl) {
            doc.setFillColor(255, 255, 255); doc.roundedRect(5, 4, 36, 26, 3, 3, 'F');
            try { doc.addImage(logoDataUrl, 'PNG', 6, 5, 34, 24); } catch (_) { }
        }
        const titleImg = renderTextToImage(reportTitle, { fontSize: 17, bold: true, color: '#FFFFFF', width: 520, height: 44, align: 'center' });
        doc.addImage(titleImg, 'PNG', pageW / 2 - 85, 3, 170, 17);
        if (subtitle) {
            const subImg = renderTextToImage(subtitle, { fontSize: 9, color: '#CCE4FF', width: 400, height: 28, align: 'center' });
            doc.addImage(subImg, 'PNG', pageW / 2 - 55, 21, 110, 9);
        }
        const dateImg = renderTextToImage(reportDate, { fontSize: 8, color: '#BBDAFF', width: 160, height: 22, align: 'right' });
        doc.addImage(dateImg, 'PNG', pageW - 58, 25, 52, 7);
    };
    drawHeader();

    const hashColIndex = headers.length - 1;
    autoTable(doc, {
        startY: 40, head: [headers], body: rows.map(r => r.map(c => String(c ?? ''))),
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 0.01, textColor: [255, 255, 255, 0], cellPadding: { top: 2, bottom: 2, left: 2, right: 2 }, lineColor: [218, 218, 218], lineWidth: 0.3, minCellHeight: 10, valign: 'middle' },
        headStyles: { fillColor: BLUE, textColor: [255, 255, 255, 0], minCellHeight: 12, lineColor: ORANGE, lineWidth: { bottom: 1.2, top: 0.3, left: 0.3, right: 0.3 } },
        alternateRowStyles: { fillColor: [240, 246, 251] },
        columnStyles: { [hashColIndex]: { cellWidth: 14, halign: 'center' } },
        margin: { top: 40, left: 8, right: 8, bottom: 16 },
        didDrawCell: data => {
            const text = String(data.cell.raw ?? '');
            if (!text?.trim()) return;
            const { x, y, width: w, height: h } = data.cell;
            const isHeader = data.section === 'head';
            const isHashCol = data.column.index === data.table.columns.length - 1;
            const img = renderTextToImage(text, {
                fontSize: isHeader ? 10 : 9, bold: isHeader,
                color: isHeader ? '#FFFFFF' : '#1A1A1A',
                width: Math.max(Math.round(w * 3.8), 50),
                height: Math.max(Math.round(h * 3.8), 20),
                align: isHashCol ? 'center' : 'right',
            });
            try { doc.addImage(img, 'PNG', x + 0.5, y + 0.3, w - 1, h - 0.6); } catch (_) { }
        },
        didDrawPage: data => {
            if (data.pageNumber > 1) drawHeader();
            const pCount = doc.internal.getNumberOfPages();
            doc.setFillColor(245, 247, 250); doc.rect(0, pageH - 12, pageW, 12, 'F');
            doc.setDrawColor(...ORANGE); doc.setLineWidth(0.5); doc.line(8, pageH - 12, pageW - 8, pageH - 12);
            const mk = (t, w, a) => renderTextToImage(t, { fontSize: 7.5, color: '#555555', width: w, height: 18, align: a });
            doc.addImage(mk(FOOTER, 340, 'right'), 'PNG', 8, pageH - 10.5, 90, 6);
            doc.addImage(mk(`${data.pageNumber} / ${pCount}`, 110, 'center'), 'PNG', pageW / 2 - 18, pageH - 10.5, 36, 6);
            doc.addImage(mk(reportDate, 160, 'left'), 'PNG', pageW - 56, pageH - 10.5, 48, 6);
        },
    });
    doc.save(filename);
}

// ════════════════════════════════════════════════════════════════════════════
// Word export
// ════════════════════════════════════════════════════════════════════════════
export async function exportWord(filename, reportTitle, subtitle, headers, rows, logoSrc) {
    const reportDate = new Date().toLocaleDateString('ar-EG');
    const logoDataUrl = await getLogoBase64(logoSrc);
    let logoBase64Raw = null, logoW = 90, logoH = 60;
    if (logoDataUrl) {
        logoBase64Raw = logoDataUrl.split(',')[1];
        await new Promise(res => {
            const img = new Image();
            img.onload = () => { if (img.naturalHeight > 0) { logoH = 60; logoW = Math.round((img.naturalWidth / img.naturalHeight) * logoH); } res(); };
            img.onerror = res; img.src = logoDataUrl;
        });
    }
    const docxModule = await import('docx');
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, WidthType, ShadingType, BorderStyle, VerticalAlign,
        PageOrientation, ImageRun } = docxModule;

    const totalDxa = 13440;
    const hashColIdx = headers.length - 1;
    const narrowW = Math.max(600, Math.floor(totalDxa * 0.05));
    const wideW = Math.floor((totalDxa - narrowW) / Math.max(headers.length - 1, 1));
    const colWidths = headers.map((_, i) => i === hashColIdx ? narrowW : wideW);
    const CB = { top: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, left: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' }, right: { style: BorderStyle.SINGLE, size: 4, color: 'D5E8F0' } };

    const makeCell = (text, { isHeader = false, width, center = false, altRow = false } = {}) =>
        new TableCell({
            width: { size: width, type: WidthType.DXA },
            shading: { fill: isHeader ? '0865A8' : altRow ? 'F0F6FB' : 'FFFFFF', type: ShadingType.CLEAR },
            borders: CB, margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
                bidirectional: true,
                alignment: center ? AlignmentType.CENTER : AlignmentType.RIGHT,
                children: [new TextRun({ text: String(text ?? ''), bold: isHeader, color: isHeader ? 'FFFFFF' : '1A1A1A', size: isHeader ? 22 : 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { value: 'ar-SA', eastAsia: 'ar-SA' } })],
            })],
        });

    const logoRuns = [];
    if (logoBase64Raw && ImageRun) {
        try {
            const binary = atob(logoBase64Raw);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            logoRuns.push(new ImageRun({ data: bytes, transformation: { width: logoW, height: logoH }, type: 'png' }), new TextRun({ text: '   ', size: 28 }));
        } catch (_) { }
    }

    const doc = new Document({
        sections: [{
            properties: { page: { size: { width: 15840, height: 12240, orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, right: 720, bottom: 900, left: 720 } } },
            children: [
                new Paragraph({
                    bidirectional: true, alignment: AlignmentType.CENTER,
                    shading: { fill: '0865A8', type: ShadingType.CLEAR },
                    border: { bottom: { style: BorderStyle.THICK, size: 18, color: 'F57C00', space: 6 } },
                    spacing: { before: 0, after: 80 },
                    children: [
                        ...logoRuns,
                        new TextRun({ text: reportTitle, color: 'FFFFFF', bold: true, size: 28, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { value: 'ar-SA', eastAsia: 'ar-SA' } }),
                        ...(subtitle ? [new TextRun({ text: `  —  ${subtitle}`, color: 'D0E8FF', size: 20, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' } })] : []),
                    ],
                }),
                new Paragraph({
                    bidirectional: true, alignment: AlignmentType.RIGHT,
                    spacing: { before: 100, after: 200 },
                    children: [new TextRun({ text: `تاريخ التقرير: ${reportDate}   |   إجمالي السجلات: ${rows.length}`, size: 18, color: '555555', italics: true, rtl: true, font: { ascii: 'Arial', hAnsi: 'Arial', cs: 'Arial' }, language: { value: 'ar-SA', eastAsia: 'ar-SA' } })],
                }),
                new Table({
                    width: { size: totalDxa, type: WidthType.DXA },
                    columnWidths: colWidths,
                    rows: [
                        new TableRow({ tableHeader: true, children: headers.map((h, i) => makeCell(h, { isHeader: true, width: colWidths[i], center: i === hashColIdx })) }),
                        ...rows.map((row, ri) => new TableRow({ children: row.map((cell, ci) => makeCell(cell, { width: colWidths[ci], center: ci === hashColIdx, altRow: ri % 2 !== 0 })) })),
                    ],
                }),
            ],
        }],
    });

    let blob;
    if (typeof Packer.toBlob === 'function') { blob = await Packer.toBlob(doc); }
    else { const buf = await Packer.toBuffer(doc); blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }); }
    triggerDownload(blob, filename);
}

// ════════════════════════════════════════════════════════════════════════════
// Row builders  (called by each tab to produce export data)
// ════════════════════════════════════════════════════════════════════════════
export function buildUsersRows(users) {
    const headers = ['#', 'الاسم الكامل', 'البريد الإلكتروني', 'اسم الدورة', 'تاريخ التسجيل'];
    const rows = [];
    let n = 1;
    users.forEach(u => {
        if (!u.enrolledCourses.length) {
            rows.push([n++, `${u.firstName} ${u.lastName}`, u.email, '—', '—']);
        } else {
            u.enrolledCourses.forEach((c, i) => {
                rows.push(i === 0
                    ? [n++, `${u.firstName} ${u.lastName}`, u.email, c.title, c.date || '—']
                    : ['', '', '', c.title, c.date || '—']);
            });
        }
    });
    return { headers, rows };
}

export function buildCoursesRows(courses) {
    const headers = ['#', 'اسم الدورة', 'الفئة', 'اسم المستخدم', 'البريد الإلكتروني', 'تاريخ التسجيل'];
    const rows = [];
    let n = 1;
    courses.forEach(c => {
        if (!c.enrolledUsers.length) {
            rows.push([n++, c.title, c.category, '—', '—', '—']);
        } else {
            c.enrolledUsers.forEach((u, i) => {
                rows.push(i === 0
                    ? [n++, c.title, c.category, `${u.firstName} ${u.lastName}`, u.email, u.date || '—']
                    : ['', '', '', `${u.firstName} ${u.lastName}`, u.email, u.date || '—']);
            });
        }
    });
    return { headers, rows };
}

export function buildAttRows(attRows, attendance) {
    const headers = ['#', 'اسم المستخدم', 'البريد الإلكتروني', 'الدورة', 'الحضور'];
    const rows = attRows.map((r, i) => [
        i + 1,
        `${r.user.firstName || r.user.username} ${r.user.lastName}`.trim(),
        r.user.email,
        r.course.title,
        attendance[String(r.course.enrollmentId)] ? 'حضر' : 'غائب',
    ]);
    return { headers, rows };
}

export function buildCertRows(certRows, certificates, attendance) {
    const headers = ['#', 'اسم المستخدم', 'البريد الإلكتروني', 'الدورة', 'الحضور', 'الشهادة'];
    const rows = certRows.map((r, i) => {
        const cert = certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined);
        const isAtt = !!attendance[String(r.enrollmentId)];
        return [
            i + 1,
            `${r.user.firstName || r.user.username} ${r.user.lastName}`.trim(),
            r.user.email,
            r.course.title,
            isAtt ? 'حضر' : 'غائب',
            cert ? (cert.name && cert.name !== 'uploaded' ? cert.name : 'مرفوعة') : 'لم تُرفع',
        ];
    });
    return { headers, rows };
}

export function buildRefundRows(filteredRefunds, usersData, coursesData) {
    const headers = ['#', 'رقم الطلب', 'المستخدم', 'البريد الإلكتروني', 'الدورة', 'المبلغ', 'العملة', 'الحالة', 'السبب', 'تاريخ الطلب'];
    const rows = filteredRefunds.map((r, i) => {
        const u = usersData.find(u => u.id === r.userId) ?? { firstName: '—', lastName: '', email: '—' };
        const c = coursesData.find(c => c.id === r.courseId) ?? { title: '—' };
        const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending;
        return [i + 1, r.refNumber || r.id, `${u.firstName} ${u.lastName}`.trim(), u.email, c.title, r.amount, r.currency, sm.label, r.reason || '', r.requestedAt || ''];
    });
    return { headers, rows };
}

// ════════════════════════════════════════════════════════════════════════════
// withExport — wraps any export fn, manages exporting/error state
// ════════════════════════════════════════════════════════════════════════════
export function withExport(setExporting, setExportError, closeMenus) {
    return fn => async () => {
        setExporting(true);
        closeMenus?.();
        setExportError(null);
        try { await fn(); }
        catch (e) { setExportError('فشل التصدير: ' + (e?.message || 'خطأ')); }
        finally { setExporting(false); }
    };
}