<?php if (!defined('HTMLY')) die('HTMLy'); ?>
<div class="archive-tag">
    <header class="archive-header">
        <h1 class="archive-title"><?php echo $title; ?></h1>
        <?php if (!empty($description)): ?><p class="archive-desc"><?php echo $description; ?></p><?php endif; ?>
    </header>

    <div class="archive-list">
        <?php foreach ($posts as $p): ?>
            <?php $img = get_image($p->body); ?>
            <article class="archive-item">
                <h2 class="entry-title"><a href="<?php echo $p->url; ?>"><?php echo $p->title; ?></a></h2>
                <div class="meta"> <span class="date"><?php echo format_date($p->date); ?></span> <span class="category"><?php echo $p->category; ?></span> </div>
                <div class="excerpt"><?php echo get_teaser($p->body, $p->url); ?></div>
            </article>
        <?php endforeach; ?>
    </div>

    <?php if (!empty($pagination['html'])): ?>
    <nav class="navigation pagination" role="navigation">
        <div class="nav-links"><?php echo $pagination['html']; ?></div>
    </nav>
    <?php endif; ?>
</div>
