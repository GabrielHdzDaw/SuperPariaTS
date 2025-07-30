precision mediump float;

uniform vec3 iResolution;
uniform float iTime;
uniform vec2 iMouse;

#define PI 3.1415

void mainImage(out vec4 o, vec2 fragCoord) {
    float t = iTime;
    vec2 u = (fragCoord - iResolution.xy * 0.5) / iResolution.y;

    o = vec4(0.0);
    float d = 0.0; 

    // Raymarch
    for (int i = 0; i < 70; i++) {
        vec3 p = vec3(u * d, d + t + t);

        // Spiral twist
        float angle = PI / 4.0;
        float ca = cos(angle);
        float sa = sin(angle);
        mat2 rot = mat2(ca, -sa, sa, ca);
        vec2 twistCenter = vec2(-0.1, -0.5);

        p.xy += twistCenter;
        p.xy = rot * p.xy;

        // Signed distance
        float s = 0.8 * sin(p.x + p.y);

        // Add distraction (fractal noise)
        float n = 1.0;
        while (n < 6.0) {
            vec3 noiseInput = (vec3(1.1, 0.8, 0.8) * p) * mod(n, 2.0);
            float noise = abs(dot(cos(noiseInput), vec3(0.3))) / n;
            s -= (0.99 + abs(u.x) * 1.0 + abs(u.y) * 2.0 + length(u) * 0.2) * noise;
            n += 0.68 * n;
        }

        float eps = 0.004 + abs(s) * 0.5;
        d += eps;
        o += vec4(1.0 / eps);
    }

    o = tanh(o / (18000.0 * length(u)));
    o.y = d / 100.0;
    o.z = 1.5 * (o.x * 0.3 + o.y * 0.9);
}

void main() {
    vec4 fragColor;
    mainImage(fragColor, gl_FragCoord.xy);
    gl_FragColor = fragColor;
}
