/*globals window, define*/
define(['require', './../utils/amdThree'], function (require, three) {

    function Render(el) {
        this.parent = el;
        this.setRenderer();
        this.setCamera();
        this.setScene();
        this.animate();
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    }

    Render.prototype = {
        setRenderer: function () {
            this.renderer = new three.WebGLRenderer();
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.parent.clientWidth, this.parent.clientHeight);
            this.parent.appendChild(this.renderer.domElement);
        },
        setCamera: function () {
            this.camera = new three.PerspectiveCamera(70, this.parent.clientWidth / this.parent.clientHeight, 1, 1000);
            this.camera.position.z = 200;

        },
        setScene: function () {
            this.scene = new three.Scene();

            var geometry = new three.BoxGeometry(100, 100, 100);

            var texture = three.ImageUtils.loadTexture(require.toUrl('../../textures/crate.gif'));
            texture.anisotropy = this.renderer.getMaxAnisotropy();

            var material = new three.MeshBasicMaterial({map: texture});

            this.mesh = new three.Mesh(geometry, material);
            this.scene.add(this.mesh);
        },
        onWindowResize: function () {

            this.camera.aspect = this.parent.clientWidth / this.parent.clientHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.parent.clientWidth, this.parent.clientHeight);

        },
        animate: function () {
            window.requestAnimationFrame(this.animate.bind(this));
            this.mesh.rotation.x += 0.005;
            this.mesh.rotation.y += 0.01;

            this.renderer.render(this.scene, this.camera);

        }
    }

    return Render;
});