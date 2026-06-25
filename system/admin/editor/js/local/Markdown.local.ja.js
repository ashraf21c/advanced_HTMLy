// 使用方法:
//
// var myConverter = new Markdown.Editor(myConverter, null, { strings: Markdown.local.ja });

(function () {
    Markdown.local = Markdown.local || {};
    Markdown.local.ja = {
        bold: "太字 <strong> Ctrl+B",
        boldexample: "太字テキスト",

        italic: "斜体 <em> Ctrl+I",
        italicexample: "斜体テキスト",

        strikethrough: "打ち消し線 <s> Ctrl+X",
        strikethroughexample: "打ち消し線テキスト",

        link: "リンク <a> Ctrl+L",
        linkdescription: "リンクの説明を入力",
        linkdialog: "<p><b>リンクを入力</b></p><p>https://example.com/ \"リンクのタイトル（任意）\"</p>",

        quote: "引用 <blockquote> Ctrl+Q",
        quoteexample: "引用テキスト",

        code: "コード <pre><code> Ctrl+K",
        codeexample: "コードをここに挿入",

        image: "画像 <img> Ctrl+G",
        imagedescription: "画像の説明を追加",
        imagedialog: "<p><b>画像を挿入</b></p><p>https://example.com/images/diagram.jpg \"画像のタイトル（任意）\"<br><br><a href='https://www.google.com/search?q=free+image+hosting' target='_blank'>無料画像ホスティング</a>をお探しですか？</p>",

        olist: "番号付きリスト <ol> Ctrl+O",
        ulist: "箇条書きリスト <ul> Ctrl+U",
        litem: "リスト項目",

        heading: "見出し Ctrl+H",
        headingexample: "見出しテキスト",

        hr: "水平線 <hr> Ctrl+R",
		
        readmore: "続きを読む <!--more--> Ctrl+M",
		
        toc: "目次 <!--toc-->",
		
        table: "表 - Ctrl+J",

        maximize: "最大化 CTRL+P",
        minimize: "最小化 CTRL+P",

        undo: "元に戻す - Ctrl+Z",
        redo: "やり直す - Ctrl+Y",
        redomac: "やり直す - Ctrl+Shift+Z",

        help: "Markdown編集ヘルプ",
		
        // RTL/LTR 追加項目
        rtl: "右から左 Ctrl+Shift+R",
        ltr: "左から右 Ctrl+Shift+L",
        rtlexample: "نص من اليمين إلى اليسار.", // 右から左へのテキスト
        ltrexample: "نص من اليسار إلى اليمين.", // 左から右へのテキスト

        math: "数式 LaTeX Ctrl+Shift+M",
        mathexample: "E = mc^2",

        superscript: "上付き文字",
        superscriptexample: "x^2",

        subscript: "下付き文字",
        subscriptexample: "H_2O",

        specialchars: "特殊文字",
        mathsymbols: "算術と代数学",
        arrows: "矢印",
        
        equation: "方程式",
        calculus: "積分計算",
        calculussymbols: "微積分",
        statistics: "統計",
        linearalgebra: "線形代数と行列",
        settheory: "集合論と論理学",
        relations: "関係と相似",
        geometry: "幾何学",
        statisticsprob: "統計学と確率論",
        aiml: "人工知能と機械学習",
        miscellaneous: "その他の記号",
        arduino: "Arduinoプログラミング",
        
        japanesegeneral: "日本語一般記号",
        kanbun: "漢文",
        radical: "部首",
        
        alignleft: "左揃え",
        aligncenter: "中央揃え",
        alignright: "右揃え"
    };
})();