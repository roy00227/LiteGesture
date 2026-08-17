from PIL import Image, ImageDraw, ImageFilter

PAD = 10           # inner padding between card border and content
RADIUS = 14         # card corner radius
SHADOW_MARGIN = 14
SHADOW_BLUR = 6
SHADOW_OFFSET_Y = 4
SHADOW_ALPHA = 70
TARGET_W, TARGET_H = 1280, 800
OUTER_MARGIN = 24   # whitespace left around the enlarged card on the final canvas


def make_card(content: Image.Image) -> Image.Image:
    content = content.convert("RGBA")
    w, h = content.size
    card_w = w + 2 * PAD
    card_h = h + 2 * PAD
    card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle(
        [0, 0, card_w - 1, card_h - 1],
        radius=RADIUS,
        fill=(255, 255, 255, 255),
    )
    card.paste(content, (PAD, PAD), content)
    return card


def add_shadow(card: Image.Image) -> Image.Image:
    w, h = card.size
    layer = Image.new("RGBA", (w + SHADOW_MARGIN * 2, h + SHADOW_MARGIN * 2), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(layer)
    sdraw.rounded_rectangle(
        [SHADOW_MARGIN, SHADOW_MARGIN + SHADOW_OFFSET_Y,
         SHADOW_MARGIN + w - 1, SHADOW_MARGIN + SHADOW_OFFSET_Y + h - 1],
        radius=RADIUS,
        fill=(0, 0, 0, SHADOW_ALPHA),
    )
    layer = layer.filter(ImageFilter.GaussianBlur(SHADOW_BLUR))
    layer.paste(card, (SHADOW_MARGIN, SHADOW_MARGIN), card)
    return layer


for lang in ["en", "jp"]:
    for part in ["top", "bottom"]:
        content = Image.open(f"images/{lang}-part-{part}.png")
        card = add_shadow(make_card(content))

        # flatten onto white
        flat = Image.new("RGB", card.size, "white")
        flat.paste(card, (0, 0), card)

        # Scale the single card up as much as possible (no distortion) so it
        # fills the store canvas, leaving only a thin, even margin.
        avail_w = TARGET_W - 2 * OUTER_MARGIN
        avail_h = TARGET_H - 2 * OUTER_MARGIN
        scale = min(avail_w / flat.size[0], avail_h / flat.size[1])
        scaled_w = round(flat.size[0] * scale)
        scaled_h = round(flat.size[1] * scale)
        scaled = flat.resize((scaled_w, scaled_h), Image.LANCZOS)

        canvas = Image.new("RGB", (TARGET_W, TARGET_H), "white")
        x_off = (TARGET_W - scaled_w) // 2
        y_off = (TARGET_H - scaled_h) // 2
        canvas.paste(scaled, (max(x_off, 0), max(y_off, 0)))
        canvas.save(f"images/{lang}-{part}-1280x800.png")
        print(lang, part, "card", flat.size, "-> scaled", scaled.size, "-> final", canvas.size)
