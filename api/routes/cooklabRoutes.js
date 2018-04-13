'use strict';

module.exports = function(app) {
  var cooklab = require('../controllers/cooklabController');
  var posting = require('../controllers/postingController');
  var user = require('../controllers/userController');
  var dish = require('../controllers/dishController');


  app.route('/achievements')
    .get(cooklab.list_all_achievements)
    .post(cooklab.create_new_achievement);

  app.route('/comments')
    .get(posting.list_all_comments);

  app.route('/create_comment')
    .post(posting.create_new_comment);

  app.route('/dishes')
    .get(dish.list_all_dishes);

  app.route('/create_dish')
    .post(dish.create_new_dish);

  app.route('/ingredients')
    .get(dish.list_all_ingredients);

  app.route('/create_ingredient')
    .post(dish.create_new_ingredient);

  app.route('/posts')
    .get(posting.list_all_posts);

  app.route('/create_post')
    .post(posting.create_new_post);

  app.route('/users')
    .get(user.list_all_users)

  app.route('/create_user')
    .post(user.create_new_user);

  app.route('/achievements/:achievementId')
    .get(cooklab.get_achievement)
    .put(cooklab.update_achievement)
    .delete(cooklab.delete_achievement);

  app.route('/comments/:commentId')
    .get(posting.get_comment)
    .put(posting.update_comment)
    .delete(posting.delete_comment);

  app.route('/dishes/:dishId')
    .get(dish.get_dish)
    .put(dish.update_dish)
    .delete(dish.delete_dish); 
    
  app.route('/ingredients/:ingredientId')
    .get(dish.get_ingredient)
    .put(dish.update_ingredient)
    .delete(dish.delete_ingredient);

  app.route('/posts/:postId')
    .get(posting.get_post_by_post_id)
    .put(posting.update_post)
    .delete(posting.delete_post);

  app.route('/posts/userId/:userId')
    .get(posting.get_images_posts_by_user_id);

  app.route('/users/:userId')
    .put(user.update_user)
    .delete(user.delete_user);

  app.route('/get_user')
    .get(user.get_user)

  app.route('/follow')
    .put(user.follow_user);

  app.route('/unfollow')
    .put(user.unfollow_user);

  app.route('/feeds')
    .get(posting.get_feeds_by_user_id);

  app.route('/topfeed')
    .get(posting.get_top_feed);

  app.route('/increase_trophy')
    .put(posting.increase_trophy);
    
  app.route('/decrease_trophy')
    .put(posting.decrease_trophy);

  app.route('/login')
    .post(user.login_by_username_and_password);

  app.route('/delete_all_user')
    .delete(user.delete_all_user);

  app.route('/delete_all_post')
    .delete(posting.delete_all_post);

  app.route('/get_user_id')
    .get(user.get_id_user_by_username);

};