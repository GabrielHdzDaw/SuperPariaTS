precision mediump float;

uniform vec3 iResolution;
uniform float iTime;
uniform vec2 iMouse;

#define CONTRAST 3.2
#define LIGHTING 0.4
#define PIXEL_FILTER 9999.0
#define PI 3.14159265359

vec4 baseColor1 = vec4(0.000, 0.478, 0.749, 1.0);
vec4 baseColor2 = vec4(0.000, 0.659, 0.608, 1.0);
vec4 baseColor3 = vec4(0.086, 0.137, 0.145, 1.0);

vec4 timeVaryingColor(vec4 a, vec4 b, float t) {
    return mix(a, b, 0.5 + 0.5 * sin(iTime * t));
}

float hash(vec2 p) {
    return fract(sin(dot(p ,vec2(127.1,311.7))) * 43758.5453);
}

float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + 
           (c - a)* u.y * (1.0 - u.x) + 
           (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
        total += noise(p) * amplitude;
        p *= 2.0;
        amplitude *= 0.5;
    }
    return total;
}

vec4 effect(vec2 screenSize, vec2 screen_coords) {
    float pixel_size = length(screenSize.xy) / PIXEL_FILTER;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy);

    uv *= 3.0;

    // Perturbaciones animadas
    float t = iTime * 0.5;
    vec2 motion = vec2(sin(t), cos(t)) * 0.5;
    vec2 noiseInput = uv * 1.5 + motion;
    float n1 = fbm(noiseInput + sin(iTime * 0.2) * 2.0);
    float n2 = fbm(uv * 3.0 + vec2(cos(iTime * 0.3), sin(iTime * 0.4)) * 3.0);
    float displacement = n1 * 0.4 + n2 * 0.3;

    uv += vec2(
        sin(uv.y * 3.0 + t) + displacement,
        cos(uv.x * 3.0 - t) - displacement
    ) * 0.3;

    float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * CONTRAST));
    float c1p = max(0.0, 1.0 - CONTRAST * abs(1.0 - paint_res));
    float c2p = max(0.0, 1.0 - CONTRAST * abs(paint_res));
    float c3p = 1.0 - min(1.0, c1p + c2p);
    float light = (LIGHTING - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + LIGHTING * max(c2p * 5.0 - 4.0, 0.0);

    vec4 color1 = timeVaryingColor(baseColor1, baseColor2, 0.7);
    vec4 color2 = timeVaryingColor(baseColor2, baseColor3, 0.3);
    vec4 color3 = timeVaryingColor(baseColor3, baseColor1, 0.2);

    return (0.3 / CONTRAST) * color1 +
           (1.0 - 0.3 / CONTRAST) * (
               color1 * c1p +
               color2 * c2p +
               vec4(c3p * color3.rgb, c3p * color1.a)
           ) + light;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    vec2 mouseOffset = (iMouse / iResolution.xy - 0.5) * 0.005;
    vec2 displacedCoord = (uv - mouseOffset) * iResolution.xy;

    fragColor = effect(iResolution.xy, displacedCoord);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
