from PIL import Image, ImageDraw, ImageFilter

PAD = 16          # inner padding between card border and content
RADIUS = 14        # card corner radius
BORDER_COLOR = (221, 221, 221, 255)
BORDER_WIDTH = 1
GAP = 56           # space between the two cards (divider line sits in the middle)
SHADOW_MARGIN = 24
SHADOW_BLUR = 8
SHADOW_OFFSET_Y = 6
SHADOW_ALPHA = 70
TARGET_W, TARGET_H = 1280, 800


def make_card(content: Image.Image, card_h: int) -> Image.Image:
    content = content.convert("RGBA")
    w, h = content.size
    card_w = w + 2 * PAD
    card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle(
        [0, 0, card_w - 1, card_h - 1],
        radius=RADIUS,
        fill=(255, 255, 255, 255),
    )
    y_off = PAD + (card_h - 2 * PAD - h) // 2
    card.paste(content, (PAD, y_off), content)
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
    top = Image.open(f"images/{lang}-part-top.png")
    bottom = Image.open(f"images/{lang}-part-bottom.png")
    card_h = max(top.size[1], bottom.size[1]) + 2 * PAD

    left_card = add_shadow(make_card(top, card_h))
    right_card = add_shadow(make_card(bottom, card_h))

    lw, lh = left_card.size
    rw, rh = right_card.size

    content_w = lw + GAP + rw
    content_h = max(lh, rh)

    composite = Image.new("RGBA", (content_w, content_h), (0, 0, 0, 0))
    composite.paste(left_card, (0, 0), left_card)
    composite.paste(right_card, (lw + GAP, 0), right_card)

    # flatten onto white
    flat = Image.new("RGB", composite.size, "white")
    flat.paste(composite, (0, 0), composite)
    flat.save(f"images/{lang}-store.png")

    # No scaling: keep native resolution (crisp, no resample blur) and just
    # pad with whitespace on every side to reach the exact store size.
    canvas = Image.new("RGB", (TARGET_W, TARGET_H), "white")
    x_off = (TARGET_W - flat.size[0]) // 2
    y_off = (TARGET_H - flat.size[1]) // 2
    canvas.paste(flat, (max(x_off, 0), max(y_off, 0)))
    canvas.save(f"images/{lang}-store-1280x800.png")
    print(lang, "composite", flat.size, "-> final", canvas.size)
