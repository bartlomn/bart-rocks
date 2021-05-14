varying vec3 vColor;
uniform sampler2D texture;
void main(){
    vec4 textureColor = texture2D( texture, gl_PointCoord );
    if ( textureColor.a < 0.3 ) discard;
    vec4 color = vec4(vColor.xyz, 1.0) * textureColor;
    gl_FragColor = color;
}