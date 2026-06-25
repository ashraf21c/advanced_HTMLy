// Usage:
//
// var myConverter = new Markdown.Editor(myConverter, null, { strings: Markdown.local.ar });

(function () {
    Markdown.local = Markdown.local || {};
    Markdown.local.ar = {
        bold: "عريض <strong> Ctrl+B",
        boldexample: "نص عريض",

        italic: "مائل <em> Ctrl+I",
        italicexample: "نص مائل",

        strikethrough: "خط في المنتصف <s> Ctrl+X",
        strikethroughexample: "نص مشطوب",

        link: "رابط تشعبي <a> Ctrl+L",
        linkdescription: "أدخل وصف الرابط هنا",
        linkdialog: "<p><b>إدراج رابط تشعبي</b></p><p>https://example.com/ \"عنوان اختياري\"</p>",

        quote: "اقتباس <blockquote> Ctrl+Q",
        quoteexample: "نص الاقتباس",

        code: "كود برمجي <pre><code> Ctrl+K",
        codeexample: "أدخل الكود هنا",

        image: "صورة <img> Ctrl+G",
        imagedescription: "أدخل وصف الصورة هنا",
        imagedialog: "<p><b>إدراج صورة</b></p><p>https://example.com/images/diagram.jpg \"عنوان اختياري\"<br><br>هل تبحث عن <a href='https://www.google.com/search?q=free+image+hosting' target='_blank'>استضافة صور مجانية؟</a></p>",

        olist: "قائمة مرقمة <ol> Ctrl+O",
        ulist: "قائمة نقطية <ul> Ctrl+U",
        litem: "عنصر قائمة",

        heading: "عنوان Ctrl+H",
        headingexample: "نص العنوان",

        hr: "خط أفقي <hr> Ctrl+R",
		
        readmore: "اقرأ المزيد <!--more--> Ctrl+M",
		
        toc: "فهرس المحتويات <!--toc-->",
		
        table: "جدول - Ctrl+J",

        maximize: "تكبير CTRL+P",
        minimize: "تصغير CTRL+P",

        undo: "تراجع - Ctrl+Z",
        redo: "إعادة - Ctrl+Y",
        redomac: "إعادة - Ctrl+Shift+Z",

        help: "مساعدة تحرير Markdown",
		
        // RTL/LTR additions
        rtl: "من اليمين لليسار Ctrl+Shift+R",
        ltr: "من اليسار لليمين Ctrl+Shift+L",
        rtlexample: "نص من اليمين إلى اليسار.",
        ltrexample: "نص من اليسار إلى اليمين.",

        math: "صيغة رياضية LaTeX Ctrl+Shift+M",
        mathexample: "E = mc^2",

        superscript: "مرتفع",
        superscriptexample: "x^2",

        subscript: "منخفض",
        subscriptexample: "H_2O",

        specialchars: "رموز خاصة",
        mathsymbols: "أساسيات الحساب والجبر",
        arrows: "أسهم",
        
        equation: "معادلة",
        calculus: "تكامل التفاضل والتكامل",
        calculussymbols: "التفاضل والتكامل",
        statistics: "إحصائيات",
        linearalgebra: "الجبر الخطي والمصفوفات",
        settheory: "نظرية المجموعات والمنطق",
        relations: "العلاقات والتشابهات",
        geometry: "الهندسة",
        statisticsprob: "الإحصاء والاحتمالات",
        aiml: "الذكاء الاصطناعي والتعلم الآلي",
        miscellaneous: "رموز متنوعة أخرى",
        arduino: "رموز برمجة الأردوينو",
        
        japanesegeneral: "الرموز اليابانية العامة",
        kanbun: "كانبون",
        radical: "الجزء الأساسي من المقطع الياباني",
        
        alignleft: "محاذاة لليسار",
        aligncenter: "محاذاة للمركز",
        alignright: "محاذاة لليمين"
    };
})();