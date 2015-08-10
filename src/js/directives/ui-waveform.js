angular.module('app').directive('uiWaveform', function() {
  console.log('BOUNDING CREATE')


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
          interpolate: true,
          innerColor: _innercolor,
          outerColor: _outercolor
        });
      var ctx = waveform.context;

      var gradient = ctx.createLinearGradient(0, 0, waveform.width, waveform.height);
      gradient.addColorStop(1.0, '#e19143');
      gradient.addColorStop(0.0, '#0984a2');
      var gradientNotAvailable = ctx.createLinearGradient(0, 0, waveform.width, waveform.height);
      gradientNotAvailable.addColorStop(1.0, '#ecc8a6');
      gradientNotAvailable.addColorStop(0.0, '#70afbe');

      waveform.innerColor = function(x, y) {
        if (startingOfClipNormalized < x && x < endingOfClipNormalized) {
          // implement here the split for time
          // need to understand how's th

          return gradient;
        } else {

          return gradientNotAvailable
        }

      };
      var totalSamples = 0;
      var startingOfClip = 0;
      var endingOfClip = 0;
      var startingOfClipNormalized = 0;
      var endingOfClipNormalized = 0;
      scope.$watch(attrs.uiWaveform, function(wave) {
        if (!wave) {
          return;
        }
        totalSamples = wave.length;
        console.log('totalSamples: ' + wave.length)
        startingOfClip = totalSamples / 2 - 640; //640 is 1:15 seconds with a sample rate of 256
        endingOfClip = startingOfClip + 1280;
        console.log('start ending frames', startingOfClip, endingOfClip)
        startingOfClipNormalized = startingOfClip / totalSamples;
        endingOfClipNormalized = endingOfClip / totalSamples;
        console.log(totalSamples)
        console.log(startingOfClipNormalized, endingOfClipNormalized)
        if (wave) {
          waveform.update({
            data: wave
          });
        }


      });
    }
  }
});
