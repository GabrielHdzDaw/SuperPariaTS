precision mediump float;

uniform vec3 iResolution;
uniform float iTime;
uniform vec2 iMouse;

#define T iTime
#define SQRT3_2 1.26
#define SQRT2_3 1.732
#define smin(a,b) (1.0 / (1.0 / (a) + 1.0 / (b)))

// --- noise functions (by Inigo Quilez)

const mat3 m = mat3(0.00,  0.80,  0.60,
                   -0.80,  0.36, -0.48,
                   -0.60, -0.48,  0.64);

float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;

    return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
               mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                   mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
}

float snoise(vec3 x) {
    return 2.0 * noise(x) - 1.0;
}

float sfbm(vec3 p) {
    float f = 0.5 * snoise(p); p = m * p * 2.02;
    f += 0.25 * snoise(p); p = m * p * 2.03;
    f += 0.125 * snoise(p); p = m * p * 2.01;
    f += 0.0625 * snoise(p);
    return f;
}

vec3 sfbm3(vec3 p) {
    return vec3(sfbm(p), sfbm(p - 327.67), sfbm(p + 327.67));
}

// --- Rotation helper
void rotate(inout vec2 v, float t) {
    float c = cos(t), s = sin(t);
    v = mat2(c, s, -s, c) * v;
}

// --- Main effect
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 p = vec4(fragCoord, 0.0, 1.0) / iResolution.yyxy - 0.5;
    p.x -= 0.4;

    vec4 d = p;
    p.z += 10.0;

    vec4 color = vec4(0.0);
    vec4 bg = vec4(0.0, 0.2, 0.0, 0.0);

    float x1, x2, x = 1e9;

    for (float i = 1.0; i > 0.0; i -= 0.01) {
        if (color.x >= 0.99) break;

        vec4 u = 0.03 * floor(p / vec4(8.0, 8.0, 1.0, 1.0) + 3.5);
        vec4 t = p;

        rotate(t.xy, u.x);
        rotate(t.xz, u.y);

        t.xyz += sfbm3(t.xyz / 2.0 + vec3(0.5 * T, 0.0, 0.0)) * (0.6 + 8.0 * (0.5 - 0.5 * cos(T / 16.0)));

        // Simula textura sin iChannel0
        vec4 c = vec4(0.1 + 0.1 * sin(t.x * 3.0 + T), 0.2 + 0.1 * sin(t.y * 3.0 + T), 0.3 + 0.1 * cos(t.x + t.y + T), 1.0);

        x = abs(mod(length(t.xyz), 1.0) - 0.5);
        x1 = length(t.xyz) - 7.0;
        x = max(x, x1);

        if (x1 > 0.1 && p.z < 0.0) break;

        if (x < 0.01) {
            color += (1.0 - color) * 0.2 * mix(bg, c, i * i);
            x = 0.1;
        }

        p += d * x;
    }

    fragColor = color;
}

void main() {
    vec4 fragColor;
    mainImage(fragColor, gl_FragCoord.xy);
    gl_FragColor = fragColor;
}
