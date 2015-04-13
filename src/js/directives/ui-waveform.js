angular.module('app').directive('uiWaveform', function() {
    console.log("BOUNDING CREATE")


    return {
        link: function(scope, element, attrs) {
            var _width = attrs.width || element.parent().width(),
                _height = attrs.height || element.parent().height(),
                _innercolor = attrs.innercolor || '#000',
                _outercolor = attrs.outercolor || '',
                waveform = new Waveform({
                    container: element[0],
                    width: _width,
                    height: _height,
                    innerColor: _innercolor,
                    outerColor: _outercolor
                });
            var ctx = waveform.context;

            var gradient = ctx.createLinearGradient(0, 0, waveform.width, waveform.height);
            gradient.addColorStop(1.0, "#dba066");
            gradient.addColorStop(0.0, "#208ea5");
            waveform.innerColor = gradient;
            scope.$watch(attrs.uiWaveform, function(wave) {
                if (wave) {
                    waveform.update({
                        data: wave
                    });
                }
            });
        }
    }
});