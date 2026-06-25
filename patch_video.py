from pathlib import Path
import re

pattern = re.compile(r'<iframe[^>]*src="https://www\.youtube\.com/embed/<\?php echo get_video_id\((\$p->video|\$post->video)\); \?>"[^>]*></iframe>')
custom = {
    'themes/ignite/post.html.php': "<?php echo generate_video_player($p->video, '100%', '100%', 'style=\"position:absolute;\" class=\"embed-responsive-item\"'); ?>",
    'themes/ignite/main.html.php': "<?php echo generate_video_player($p->video, '100%', '100%', 'style=\"position:absolute;\" class=\"embed-responsive-item\"'); ?>",
    'themes/tailwind/static--front.html.php': "<?php echo generate_video_player($p->video, '100%', '100%', 'class=\"absolute inset-0 w-full h-full\"'); ?>",
    'themes/tailwind/profile.html.php': "<?php echo generate_video_player($p->video, '100%', '100%', 'class=\"absolute inset-0 w-full h-full\"'); ?>",
    'themes/tailwind/post.html.php': "<?php echo generate_video_player($p->video, '100%', '100%', 'class=\"absolute inset-0 w-full h-full\"'); ?>",
    'themes/tailwind/main.html.php': "<?php echo generate_video_player($p->video, '100%', '100%', 'class=\"absolute inset-0 w-full h-full\"'); ?>",
    'themes/occasio-1.13/post.html.php': "<?php echo generate_video_player($p->video, '100%', '100%'); ?>",
    'themes/occasio-1.13/main.html.php': "<?php echo generate_video_player($p->video, '100%', '100%'); ?>",
}

patched = []
for path in Path('themes').rglob('*.php'):
    content = path.read_text(encoding='utf-8')
    if 'https://www.youtube.com/embed/<?php echo get_video_id(' in content:
        key = path.as_posix().replace('\\', '/')
        replacement = custom.get(key)
        if replacement is None:
            new_content = pattern.sub(lambda m: '<?php echo generate_video_player(%s); ?>' % m.group(1), content)
        else:
            new_content = pattern.sub(replacement, content)
        if new_content != content:
            path.write_text(new_content, encoding='utf-8')
            patched.append(key)

print('patched files:', len(patched))
for p in patched:
    print(p)
