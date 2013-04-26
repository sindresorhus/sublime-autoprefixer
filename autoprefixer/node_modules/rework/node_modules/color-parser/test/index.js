
var parse = require('..');

describe('named', function(){
  it('should parse', function(){
    parse('blue').r.should.equal(0);
    parse('blue').g.should.equal(0);
    parse('blue').b.should.equal(255);
  })
  
  it('should parse case insensitive', function(){
    parse('Blue').r.should.equal(0);
    parse('BLUE').g.should.equal(0);
    parse('Blue').b.should.equal(255);
  })
})

describe('#RGB', function(){
  it('should parse', function(){
    parse('#fc0').r.should.equal(255);
    parse('#fc0').g.should.equal(204);
    parse('#fc0').b.should.equal(0);
    parse('#fc0').a.should.equal(1);
  })
})

describe('#RRGGBB', function(){
  it('should parse', function(){
    parse('#ffcc00').r.should.equal(255);
    parse('#ffcc00').g.should.equal(204);
    parse('#ffcc00').b.should.equal(0);
    parse('#ffcc00').a.should.equal(1);
  })
})

describe('rgb(n, n, n)', function(){
  it('should parse', function(){
    parse('rgb(255, 204, 0)').r.should.equal(255);
    parse('rgb(255, 204, 0)').g.should.equal(204);
    parse('rgb(255, 204, 0)').b.should.equal(0);
    parse('rgb(255, 204, 0)').a.should.equal(1);
  })
})

describe('rgba(n, n, n, n)', function(){
  it('should parse', function(){
    parse('rgba(255, 204, 0, 1)').r.should.equal(255);
    parse('rgba(255, 204, 0, 1)').g.should.equal(204);
    parse('rgba(255, 204, 0, 1)').b.should.equal(0);
    parse('rgba(255, 204, 0, 1)').a.should.equal(1);
  })

  it('should support floats', function(){
    parse('rgba(0,0,0,0.5)').a.should.equal(0.5);
    parse('rgba(0,0,0,.5)').a.should.equal(0.5);
    parse('rgba(0,0,0,.75)').a.should.equal(0.75);
  })
})