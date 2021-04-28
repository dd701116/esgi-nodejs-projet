const assert = require('assert');
const note = require('../models/note.model');
const {CustomError, ErrorFactory} = require('../models/CustomError');



describe('The note module', () => {
    it('Should create a note object', async () => {
        let result = note.create(1234, "blablabla");
        assert.strictEqual(result.constructor.name, "Note");
    });

    it("Should show 'Le format de la note n'est pas accepté'", () => {
        assert.throws(() => {
            note.create(1234, 1234);
            }, new CustomError("Le format de la note n'est pas accepté", 400)
        );
    });

    it("Should show 'La note ne peut être vide'", () => {
        assert.throws(() => {
            note.create(1234, "");
        }, ErrorFactory("note.noContent")
        );
    });

    it("Should show 'L\'utilisateur ne peut etre vide'", () => {
        assert.throws(() => {
            note.create("");
        }, new CustomError("L'utilisateur ne peut etre vide", 400)
        );
    });

});