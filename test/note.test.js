const assert = require('assert');
const note = require('../models/note.model');
const customError = require('../models/CustomError');



describe('The note module', () => {
    it('Should be create a note object', async () => {
        let result = note.create(1234, "blablabla");
        assert.strictEqual(result.constructor.name, "Note");
    });

    it("Should be show 'Le format de la note n'est pas accepté'", () => {
        assert.throws(() => {
            note.create(1234, 1234);
            }, new customError("Le format de la note n'est pas accepté", 400)
        );
    });

    it("Should be show 'La note ne peut être vide'", () => {
        assert.throws(() => {
            note.create(1234, "");
        }, new customError("La note ne peut être vide", 400)
        );
    });

    it("Should be show 'L\'utilisateur ne peut etre vide'", () => {
        assert.throws(() => {
            note.create("");
        }, new customError("L'utilisateur ne peut etre vide", 400)
        );
    });


});