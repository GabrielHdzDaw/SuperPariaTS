precision mediump float;

uniform vec3 iResolution;
uniform float iTime;
uniform vec2 iMouse;

#define iterations 12
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.1

#define zoom   0.800
#define tile   0.850
#define speed  0.000

#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850

float happy_star(vec2 uv, float anim) {
    uv = abs(uv);
    vec2 pos = min(uv.xy / uv.yx, anim);
    float p = (2.0 - pos.x - pos.y);
    return (2.0 + p * (p * p - 1.5)) / (uv.x + uv.y);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    uv.x *= iResolution.x / iResolution.y;

    vec4 o = vec4(0.0);
    float d = 0.0, s2 = 0.0, a = 0.0;
    vec2 u = fragCoord;
    vec3 p = iResolution;

    u = (u + u - p.xy) / p.y;
    if (iTime < 1.0 || abs(u.y) > 0.8) {
        fragColor = vec4(0.0);
        return;
    }

    for (float i = 1.0; i < 64.0; i++) {
        d += s2 = 0.05 + abs(s2) * 0.2;
        o += 1.0 / max(s2 * d, 0.005);

        p = vec3(u * d, d);
        float t = iTime;
        mat2 rot = mat2(cos(0.0 * t + p.z * 0.2), -sin(0.0 * t + p.z * 0.2),
                        sin(0.0 * t + p.z * 0.2),  cos(0.0 * t + p.z * 0.2));
        p.xy *= rot;

        s2 = 4.0 - abs(p.x);
        a = 1.0;
        for (; a < 24.0; a += a) {
            s2 -= abs(dot(sin(0.0 * t + 0.1 * p.z + p * a), 1.3 + p - p)) / a;
        }
    }

    o = tanh(vec4(8.0 - cos(0.0 * iTime) * 3.0, 2.5 - cos(0.0 * iTime) * 0.5, 1.0, 0.0) * o / 400.0);
    o.rgb *= vec3(0.1, 0.2, 1.0);

    float t2 = iTime * 0.10;
    float height =
        0.1 * sin(5.0 * uv.x + t2) +
        0.1 * sin(5.0 * uv.y + t2 * 0.8) +
        0.15 * sin(uv.x * uv.y * 10.0 - t2 * 1.5);

    vec2 warpedUV = uv + height * 0.7;
    warpedUV = warpedUV * 0.5 + 0.5;
    uv += warpedUV;

    vec3 dir = normalize(vec3(uv * zoom, 0.02));
    float time = iTime * speed + 0.25;

    vec3 from = vec3(1.0, 0.5, 0.5) * o.xyz;

    float s = 0.1, fade = 1.0;
    vec3 v = vec3(0.0);

    for (int r = 0; r < volsteps; r++) {
        vec3 pp = from + s * dir * 0.5;
        pp = abs(vec3(tile) - mod(pp, vec3(tile * 2.0)));

        float pa = 0.0, a = 0.0;
        for (int j = 0; j < iterations; j++) {
            pp = abs(pp) / dot(pp, pp) - formuparam;
            pp.xy *= mat2
