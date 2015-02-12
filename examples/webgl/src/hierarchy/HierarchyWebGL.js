/**
 * Created by guntars on 12/02/15.
 */
define(['./../utils/amdThree'], function (three) {

    function Hierarchy(el) {
        this.container = el;
        var style = window.getComputedStyle(el, null);

        this.width = Number(style.width.slice(0, -2));
        this.height = Number(style.height.slice(0, -2));

        this.mouseX = 0;
        this.mouseY = 0;

        this.windowHalfX = this.width / 2;
        this.windowHalfY = this.height / 2;

        this.diff = this.width / this.height;

        this.camera = new three.PerspectiveCamera(60, this.diff, 1, 15000);
        this.camera.position.z = 500;

        this.scene = new three.Scene();

        var geometry = new three.BoxGeometry(100, 100, 100);
        var material = new three.MeshNormalMaterial();

        this.root = new three.Mesh(geometry, material);
        this.root.position.x = 1000;
        this.scene.add(this.root);

        var amount = 200, object,
            parent = this.root;

        for (var i = 0; i < amount; i++) {

            object = new three.Mesh(geometry, material);
            object.position.x = 100;

            parent.add(object);
            parent = object;

        }

        parent = this.root;

        for (var i = 0; i < amount; i++) {

            object = new three.Mesh(geometry, material);
            object.position.x = -100;

            parent.add(object);
            parent = object;

        }

        parent = this.root;

        for (var i = 0; i < amount; i++) {

            object = new three.Mesh(geometry, material);
            object.position.y = -100;

            parent.add(object);
            parent = object;

        }

        parent = this.root;

        for (var i = 0; i < amount; i++) {

            object = new three.Mesh(geometry, material);
            object.position.y = 100;

            parent.add(object);
            parent = object;

        }

        parent = this.root;

        for (var i = 0; i < amount; i++) {

            object = new three.Mesh(geometry, material);
            object.position.z = -100;

            parent.add(object);
            parent = object;

        }

        parent = this.root;

        for (var i = 0; i < amount; i++) {

            object = new three.Mesh(geometry, material);
            object.position.z = 100;

            parent.add(object);
            parent = object;

        }

        this.renderer = new three.WebGLRenderer();
        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.sortObjects = false;
        this.container.appendChild(this.renderer.domElement);

        //

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.animate();
        this.onDocumentMouseMove();
    }

    Hierarchy.prototype = {

        render: function () {

            var time = Date.now() * 0.001;

            var rx = Math.sin(time * 0.7) * 0.2;
            var ry = Math.sin(time * 0.3) * 0.1;
            var rz = Math.sin(time * 0.2) * 0.1;

            this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;
            this.camera.position.y += ( -this.mouseY - this.camera.position.y ) * .05;

            this.camera.lookAt(this.scene.position);

            this.root.traverse(function (object) {

                object.rotation.x = rx;
                object.rotation.y = ry;
                object.rotation.z = rz;

            });

            this.renderer.render(this.scene, this.camera);

        },
        animate: function () {

            window.requestAnimationFrame(this.animate.bind(this));

            this.render();

        },

        onWindowResize: function () {
            this.width = this.container.clientWidth;
            this.height = this.container.clientHeight;

            this.windowHalfX = this.width / 2;
            this.windowHalfY = this.height / 2;

            this.diff = this.width / this.height;

            this.camera.aspect = this.diff;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.width, this.height);

        },

        onDocumentMouseMove: function () {
            document.addEventListener('mousemove', function (event) {
                this.mouseX = ( event.clientX - this.windowHalfX ) * 10;
                this.mouseY = ( event.clientY - this.windowHalfY ) * 10;

            }.bind(this), false);

        }

    };
    return Hierarchy;
});