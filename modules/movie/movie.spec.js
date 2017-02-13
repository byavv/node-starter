const expect = require('chai').expect
    , request = require('supertest')
    , sinon = require('sinon')
    , loadServer = require('../../test/initTestServer')
    ;
/**
 * Links: 
 *        http://chaijs.com/api/bdd/
 *        http://sinonjs.org/docs/
 */
describe('CONTROLLERS TESTS', function () {
    let findStub
        , findOneStub
        , createStub
        , movieModel
        , server
        ;

    before((done) => {
        loadServer((err, app) => {
            if (err) return done(err);
            server = app;
            movieModel = server.locals.models.movie;
            done();
        });
    });

    beforeEach(() => {
        findStub = sinon.stub(movieModel, 'find');
        findOneStub = sinon.stub(movieModel, 'findOne');
        createStub = sinon.stub(movieModel, 'create');
    })

    afterEach(() => {
        findStub.restore();
        findOneStub.restore();
        createStub.restore();
    })

    describe('Movies controller', function () {

        it('should return movies array', function (done) {
            findStub.yields(null, [{ title: 'title' }])
            request(server)
                .get('/api/v1/movies')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.body).to.deep.equal({ movies: [{ title: 'title' }] });
                    done();
                });
        });

        it('should handle database error and render error page', function (done) {
            findStub.yields(new Error(), null);
            request(server)
                .get('/api/v1/movies')
                .expect('Content-Type', /text/)
                .expect(500)
                .end(done);
        });

        it('should build filter object', function (done) {
            findStub.yields(null, []);
            request(server)
                .get('/api/v1/movies')
                .query({
                    where: {
                        title: {
                            $eq: 'title'
                        }
                    }
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(findStub.calledWith({
                        title: {
                            $eq: 'title'
                        }
                    })).to.be.true;
                    done();
                });
        });

        it('should create new movie', function (done) {
            createStub.yields(null, { title: 'Avatar' });
            request(server)
                .post('/api/v1/movies')
                .send({ title: 'Avatar' })
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.body.title).to.eql('Avatar');
                    expect(createStub.calledWith({ title: 'Avatar' })).to.be.true;
                    done();
                });
        });

        // ... and so on, and so forth
    });
});