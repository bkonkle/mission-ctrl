/* eslint no-var:0 */
var chai = require('chai')
var chaiImmutable = require('chai-immutable')
var sinonChai = require('sinon-chai')
require('babel-register')

chai.use(chaiImmutable)
chai.use(sinonChai)
