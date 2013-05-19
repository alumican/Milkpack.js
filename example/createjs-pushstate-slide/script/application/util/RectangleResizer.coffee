class RectangleResizer

    @EXACT_FIT = 'ecaxtFit'
    @SHOW_ALL  = 'showAll'
    @NO_BORDER = 'noBorder'
    @NO_SCALE  = 'noScale'

    @TOP_LEFT     = 'TL'
    @TOP          = 'T'
    @TOP_RIGHT    = 'TR'
    @LEFT         = 'L'
    @CENTER       = ''
    @RIGHT        = 'R'
    @BOTTOM_LEFT  = 'BL'
    @BOTTOM       = 'B'
    @BOTTOM_RIGHT = 'BR'

    @resize: (target, boundary, scaleMode = 'showAll', align = '') ->
        x0 = target.x
        y0 = target.y
        w0 = target.width
        h0 = target.height
        x1 = boundary.x
        y1 = boundary.y
        w1 = boundary.width
        h1 = boundary.height

        switch scaleMode
            when 'showAll', 'noBorder'
                ratioW = w1 / w0
                ratioH = h1 / h0
                ratio  = if scaleMode == 'showAll' then (if ratioW < ratioH then ratioW else ratioH) else (if ratioW > ratioH then ratioW else ratioH)
                w0 *= ratio
                h0 *= ratio

            when 'exactFit'
                return { x: x1, y: y1, width: w1, height: h1, scaleX: w1 / w0, scaleY: h1 / h0 }

        x0 = x1 + ( if align == 'TL' || align == 'L' || align == 'BL' then 0 else (if align == 'TR' || align == 'R' || align == 'BR' then (w1 - w0) else ((w1 - w0) / 2)) )
        y0 = y1 + ( if align == 'TL' || align == 'T' || align == 'TR' then 0 else (if align == 'BL' || align == 'B' || align == 'BR' then (h1 - h0) else ((h1 - h0) / 2)) )

        return { x: x0, y: y0, width: w0, height: h0, scaleX: w0 / target.width, scaleY: h0 / target.height }

    @rect: (x, y, width, height) ->
        return { x: x, y: y, width: width, height: height }

# export class
window.RectangleResizer = RectangleResizer
