const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const {createCanvas, loadImage, Image} = require('canvas');
const canvas = createCanvas(500,333);
const ctx = canvas.getContext('2d');
const clarifai = require('clarifai');

let imageURL = '';
let mask = '';
const app = new Clarifai.App({apiKey:'f47d67c9eb4c49d993750b26b685a0a9'});
router.get('/', (req,res,next) => {
    imageURL = req.query.imageInput;
    mask = req.query.maskImage;
    app.models.predict("a403429f2ddf4b49b307e318f00e528b", imageURL)
    .then(response => {
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        let faceBoundaries = response.outputs[0].data.regions[0].region_info.bounding_box;
        let height = (faceBoundaries.bottom_row-faceBoundaries.top_row) * 333;
        let width = (faceBoundaries.right_col - faceBoundaries.left_col) * 500;
        let x_value =  faceBoundaries.left_col * 500;
        let y_value =  faceBoundaries.top_row * 333;
        loadImage(imageURL).then((image) => {
            ctx.drawImage(image, 0, 0, 500, 333);
        })
        loadImage(mask).then((mask)=>{
            ctx.drawImage(mask,x_value, y_value, width, height);
            let stream = canvas.toDataURL();
                // console.log(stream);
                cloudinary.config({ 
                cloud_name: 'dykqf3wgp', 
                api_key: '674816578322183', 
                api_secret: 'PVdFyXWQs8jFVXjDVCOLrU3804A' 
                });
                
                cloudinary.v2.uploader.upload(stream, 
                    function(error, result) {
                        // console.log(result, error);
                        outputImageUrl = result.url;
                        res.status(200).json({
                            message: 'face present in the given image',
                            height_bounding_box: height,
                            width_bounding_box: width,
                            x_coordinate:x_value,
                            y_coordinate:y_value,
                            output_url: outputImageUrl,
                        });
                    });
        });
    })
    .catch(err => {console.log(err)});
});


module.exports = router; 
