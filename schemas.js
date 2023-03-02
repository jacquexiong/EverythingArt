const Joi = require('joi');

module.exports.artpieceSchema = Joi.object({
    artpiece: Joi.object({
        title: Joi.string().required(),
        artist: Joi.string().required(),
        description: Joi.string().required(),
        // images: Joi.object().required(),
    }).required(),
    deleteImages: Joi.array()
});