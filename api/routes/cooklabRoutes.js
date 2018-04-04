'use strict';

module.exports = function(app) {
  var cooklab = require('../controllers/cooklabController');

  app.route('/achievements')
    .get(cooklab.list_all_achievements)
    .post(cooklab.create_new_achievement);

  app.route('/comments')
    .get(cooklab.list_all_comments)
    .post(cooklab.create_new_comment);

  app.route('/dishes')
    .get(cooklab.list_all_dishes)
    .post(cooklab.create_new_dish);

  app.route('/ingredients')
    .get(cooklab.list_all_ingredients)
    .post(cooklab.create_new_ingredient);

  app.route('/posts')
    .get(cooklab.list_all_posts)
    .post(cooklab.create_new_post);

  app.route('/users')
    .get(cooklab.list_all_users)

  app.route('/create_user')
    .post(cooklab.create_new_user);

  app.route('/achievements/:achievementId')
    .get(cooklab.get_achievement)
    .put(cooklab.update_achievement)
    .delete(cooklab.delete_achievement);

  app.route('/comments/:commentId')
    .get(cooklab.get_comment)
    .put(cooklab.update_comment)
    .delete(cooklab.delete_comment);

  app.route('/dishes/:dishId')
    .get(cooklab.get_dish)
    .put(cooklab.update_dish)
    .delete(cooklab.delete_dish); 
    
  app.route('/ingredients/:ingredientId')
    .get(cooklab.get_ingredient)
    .put(cooklab.update_ingredient)
    .delete(cooklab.delete_ingredient);

  app.route('/posts/:postId')
    .get(cooklab.get_post_by_post_id)
    .put(cooklab.update_post)
    .delete(cooklab.delete_post);

  app.route('/posts/userId/:userId')
    .get(cooklab.get_images_posts_by_user_id);

  app.route('/users/:userId')
    .get(cooklab.get_user)
    .put(cooklab.update_user)
    .delete(cooklab.delete_user);

  app.route('/follow/:userId/:targetId')
    .put(cooklab.follow_user);

  app.route('/unfollow/:userId/:targetId')
    .put(cooklab.unfollow_user);

  app.route('/feeds/:userId')
    .get(cooklab.get_feeds_by_user_id);

  app.route('/topfeed')
    .get(cooklab.get_top_feed);

  app.route('/love/:postId/:userId')
    .put(cooklab.love_post);
    
  app.route('/dislove/:postId/:userId')
    .put(cooklab.dislove_post);

  app.route('/login')
    .post(cooklab.login_by_username_and_password);
};