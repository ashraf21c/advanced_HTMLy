// Usage:
//
// var myConverter = new Markdown.Editor(myConverter, null, { strings: Markdown.local.fr });

(function () {
    Markdown.local = Markdown.local || {};
    Markdown.local.fr = {
        bold: "Gras <strong> Ctrl+B",
        boldexample: "texte en gras",

        italic: "Italique <em> Ctrl+I",
        italicexample: "texte en italique",

        link: "Hyperlien <a> Ctrl+L",
        linkdescription: "description de l'hyperlien",
        linkdialog: "<p><b>Insérer un hyperlien</b></p><p>http://example.com/ \"titre optionnel\"</p>",

        quote: "Citation <blockquote> Ctrl+Q",
        quoteexample: "Citation",

        code: "Extrait de code <pre><code> Ctrl+K",
        codeexample: "votre extrait de code",

        image: "Image <img> Ctrl+G",
        imagedescription: "description de l'image",
        imagedialog: "<p><b>Insérer une image</b></p><p>http://example.com/images/diagram.jpg \"titre optionnel\"<br><br><a href='http://www.google.com/search?q=free+image+hosting' target='_blank'>Vous chercher un hébergement d'image grauit ?</a></p>",

        olist: "Liste numérotée <ol> Ctrl+O",
        ulist: "Liste à point <ul> Ctrl+U",
        litem: "Elément de liste",

        heading: "Titre <h1>/<h2> Ctrl+H",
        headingexample: "Titre",

        hr: "Trait horizontal <hr> Ctrl+R",

        undo: "Annuler - Ctrl+Z",
        redo: "Refaire - Ctrl+Y",
        redomac: "Refaire - Ctrl+Shift+Z",

        help: "Aide sur Markdown",

        math: "Formule mathématique LaTeX Ctrl+Shift+M",
        mathexample: "E = mc^2",

        superscript: "Exposant",
        superscriptexample: "x^2",

        subscript: "Indice",
        subscriptexample: "H_2O",

        specialchars: "Caractères spéciaux",
        mathsymbols: "Arithmétique et Algèbre",
        arrows: "Flèches",
        
        equation: "Équation",
        calculus: "Intégrale de Calcul",
        calculussymbols: "Calcul",
        statistics: "Statistiques",
        linearalgebra: "Algèbre linéaire et Matrices",
        settheory: "Théorie des ensembles et Logique",
        relations: "Relations et Similarité",
        geometry: "Géométrie",
        statisticsprob: "Statistiques et Probabilités",
        aiml: "IA et Apprentissage automatique",
        miscellaneous: "Symboles Divers",
        arduino: "Programmation Arduino",
        
        japanesegeneral: "Symboles généraux japonais",
        kanbun: "Kanbun",
        radical: "Radical",
        
        alignleft: "Aligner à gauche",
        aligncenter: "Centrer",
        alignright: "Aligner à droite"
    };
})();