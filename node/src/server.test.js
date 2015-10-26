import ajax from 'xmlhttprequest';
import _ from './server.js';
import config from 'config';

describe('server', () => {

    beforeEach(()=> {

    });

    var getRequest = function (cookie, successCallback) {

        var xhr = new ajax.XMLHttpRequest();
        var url = 'http://localhost:' + config.get('http-port') + '/';

        xhr.open('GET', url);
        xhr.setDisableHeaderCheck(true);

        xhr.setRequestHeader('cookie', cookie);

        xhr.onerror = function () {
          console.log(xhr.responseText);
        };
        xhr.onload = successCallback;

        return xhr;
    };
    
    it('should reverse proxy to w3c', done => {
        setTimeout(function () {
        }, 0);

        var xhr = getRequest('LB_PROXY_SERVER=first', function () {

          expect(xhr.getResponseHeader('server')).toContain('Apache/2');
          expect(xhr.responseText).toContain('Contact W3C');
          done();
        });

        xhr.send();
    });

    it('should reverse proxy to google', done => {
        setTimeout(function () {
        }, 0);

        var xhr = getRequest('LB_PROXY_SERVER=second', function () {

          expect(xhr.getResponseHeader('server')).toContain('sffe');
          expect(xhr.responseText).toContain('Google Search');
          done();
        });

        xhr.send();
    });
});
