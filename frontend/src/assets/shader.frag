precision mediump float;

uniform vec3 iResolution;
uniform float iTime;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
	vec2 p = fragCoord.xy / iResolution.xy;
	vec2 q = p - vec2(0.5, 0.5);
	vec3 col = vec3(1.0, 0.4, 0.1);
	
	float r = 0.2 + 0.1 * cos(atan(q.y, q.x) + 10.0);

	col *= smoothstep(r, r + 0.01, length(q));
	fragColor = vec4(col, 1.0);
	
   
   
   
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
