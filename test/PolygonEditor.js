describe('L.PolygonEditor', function() {
    var mouse, polygon;

    before(function () {
        this.map = map;
    });
    after(function () {
        polygon.editor.disable();
        this.map.removeLayer(polygon);
    });

    describe('#startNewPolygon()', function() {

        it('should create feature and editor', function() {
            this.map.editable.startPolygon();
            assert.ok(this.map.editable.activeEditor);
            polygon = this.map.editable.activeEditor.feature;
            assert.ok(polygon);
            assert.notOk(this.map.editable.activeEditor.feature._latlngs.length);
        });

        it('should create latlng on click', function () {
            happen.at('mousemove', 100, 150);
            happen.at('click', 100, 150);
            assert.equal(this.map.editable.activeEditor.feature._latlngs.length, 1);
            happen.at('mousemove', 200, 350);
            happen.at('click', 200, 350);
            assert.equal(this.map.editable.activeEditor.feature._latlngs.length, 2);
            happen.at('mousemove', 300, 250);
            happen.at('click', 300, 250);
            assert.equal(this.map.editable.activeEditor.feature._latlngs.length, 3);
            happen.at('mousemove', 300, 150);
            happen.at('click', 300, 150);
            assert.equal(this.map.editable.activeEditor.feature._latlngs.length, 4);
        });

        it('should finish shape on last point click', function () {
            happen.at('click', 300, 150);
            assert.equal(this.map.editable.activeEditor.feature._latlngs.length, 4);
        });

    });

    describe('#disable()', function () {

        it('should stop editing on disable() call', function () {
            polygon.endEdit();
            assert.notOk(this.map.editable.activeEditor);
        });

    });

    describe('#enable()', function () {

        it('should start editing on enable() call', function () {
            polygon.edit();
            assert.ok(this.map.editable.activeEditor);
        });

    });

    describe('#dragVertex()', function () {

        it('should update latlng on vertex drag', function (done) {
            var before = this.map.editable.activeEditor.feature._latlngs[2].lat,
                self = this;
            happen.drag(300, 250, 310, 260, function () {
                assert.notEqual(before, self.map.editable.activeEditor.feature._latlngs[2].lat);
                done();
            });
        });

    });

    describe('#deleteVertex()', function () {

        it('should delete latlng on vertex click', function () {
            happen.at('click', 200, 350);
            assert.equal(this.map.editable.activeEditor.feature._latlngs.length, 3);
        });

    });

    describe('#dragMiddleMarker()', function (done) {

        it('should insert new latlng on middle marker click', function (done) {
            var first = this.map.editable.activeEditor.feature._latlngs[0],
                second = this.map.editable.activeEditor.feature._latlngs[1],
                self = this,
                fromX = (100 + 310) / 2,
                fromY = (150 + 260) / 2;
            happen.drag(fromX, fromY, 150, 300, function () {
                assert.equal(self.map.editable.activeEditor.feature._latlngs.length, 4);
                // New should have been inserted between first and second latlng,
                // so second should equal third, and first should not have changed
                assert.equal(first, self.map.editable.activeEditor.feature._latlngs[0]);
                assert.equal(second, self.map.editable.activeEditor.feature._latlngs[2]);
                done();
            });
        });

    });

    describe('#newHole', function () {

        it('should create new hole on click', function () {
            assert.notOk(polygon._holes);
            polygon.editor.newHole();
            happen.at('mousemove', 150, 170);
            happen.at('click', 150, 170);
            assert.equal(polygon._holes.length, 1);
            assert.equal(polygon._holes[0].length, 1);
            happen.at('mousemove', 200, 250);
            happen.at('click', 200, 250);
            assert.equal(polygon._holes[0].length, 2);
            happen.at('mousemove', 250, 250);
            happen.at('click', 250, 250);
            assert.equal(polygon._holes[0].length, 3);
            happen.at('mousemove', 250, 200);
            happen.at('click', 250, 200);
            assert.equal(polygon._holes[0].length, 4);
        });

        it('should not create new point when clicking outside', function () {
            happen.at('click', 400, 400);
            assert.equal(polygon._holes[0].length, 4);
        });

        it('should finish shape on last point click', function () {
            happen.at('click', 250, 200);
            happen.at('click', 260, 210);
            assert.equal(polygon._holes[0].length, 4);
        });

    });

});
