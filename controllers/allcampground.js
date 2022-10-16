const Campground = require("../models/campground");

module.exports.index = async (req, resp) => {
    const campground = await Campground.find({});
    resp.render("campground/index", { campground });
}

module.exports.renderNewForm = (req, resp) => {
    resp.render("campground/new");
}

module.exports.createNewCamp = async (req, resp, next) => {

    //route err to next where err is handle
    const icamp = new Campground(req.body.campground); //acces the form elements
    icamp.author = req.user._id;
    await icamp.save();
    req.flash('success', 'Successfully made a new campground !');
    resp.redirect(`/campground/${icamp._id}`);
}


module.exports.showOneCamp = async (req, resp) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate
        ({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');//to show with reviews
    // console.log(camp);
    if (!camp) {
        req.flash('error', 'This Camp not exist...');
        resp.redirect('/campground');
    }
    // console.log(camp);
    resp.render("campground/show", { camp });
}


module.exports.editOneCampForm = async (req, resp) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot find the camp...😥');
        return resp.redirect('/camphround');
    }
    resp.render("campground/edit", { camp });
}


module.exports.updatingCamp = async (req, resp) => {
    const { id } = req.params;
    const campp = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    req.flash('success', "Successfullly updated Campground !!");
    resp.redirect(`/campground/${campp._id}`);
}


module.exports.deleteCamp = async (req, resp) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "You Deleted the camp....");
    resp.redirect("/campground");
}