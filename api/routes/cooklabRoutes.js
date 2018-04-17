'use strict';

module.exports = function(app) {
  var cooklab = require('../controllers/cooklabController')
  var posting = require('../controllers/postingController')
  var user = require('../controllers/userController')
  var dish = require('../controllers/dishController')


  app.route('/achievements')
    .get(cooklab.list_all_achievements)

  app.route('/create_achievement')
    .post(cooklab.create_new_achievement)

  app.route('/comments')
    .get(posting.list_all_comments)

  app.route('/create_comment')
    .post(posting.create_new_comment)

  app.route('/dishes')
    .get(dish.list_all_dishes)

  app.route('/create_dish')
    .post(dish.create_new_dish)

  app.route('/ingredients')
    .get(dish.list_all_ingredients)

  app.route('/create_ingredient')
    .post(dish.create_new_ingredient)

  app.route('/posts')
    .get(posting.list_all_posts)

  app.route('/create_post')
    .post(posting.create_new_post)

  app.route('/users')
    .get(user.list_all_users)

  app.route('/create_user')
    .post(user.create_new_user)

  app.route('/get_achievement')
    .get(cooklab.get_achievement)

  app.route('/update_achievement')
    .put(cooklab.update_achievement)

  app.route('/delete_achievement')
    .delete(cooklab.delete_achievement)

  app.route('/get_comment')
    .get(posting.get_comment)

  app.route('/update_comment')
    .put(posting.update_comment)

  app.route('/delete_comment')
    .delete(posting.delete_comment)

  app.route('/get_dish')
    .get(dish.get_dish)

  app.route('/update_dish')
    .put(dish.update_dish)

  app.route('/delete_dish')
    .delete(dish.delete_dish)
    
  app.route('/update_ingredient')
    .put(dish.update_ingredient)

  app.route('/get_ingredient')
    .get(dish.get_ingredient)

  app.route('/delete_ingredient')
    .delete(dish.delete_ingredient)

  app.route('/get_post')
    .get(posting.get_post_by_post_id)
   
  app.route('/update_post')  
    .put(posting.update_post)

  app.route('/delete_post')
    .delete(posting.delete_post)

  app.route('/get_user_post')
    .get(posting.get_image_post_by_user_id)

  app.route('/users')
    .delete(user.delete_user)

  app.route('/update_user')
    .put(user.update_user)

  app.route('/get_user')
    .get(user.get_user)

  app.route('/follow')
    .put(user.follow_user)

  app.route('/feeds')
    .get(posting.get_feeds_by_user_id)

  app.route('/topfeed')
    .get(posting.get_top_feed)

  app.route('/increase_trophy')
    .put(posting.increase_trophy)
    
  app.route('/decrease_trophy')
    .put(posting.decrease_trophy)

  app.route('/login_by_username')
    .post(user.login_by_username_and_password)

  app.route('/login_with_facebook')
    .post(user.login_with_facebook)

  app.route('/delete_all_user')
    .delete(user.delete_all_user)

  app.route('/delete_all_post')
    .delete(posting.delete_all_post)

  app.route('/get_user_id')
    .get(user.get_id_user_by_username)

  app.route('/search')
    .get(cooklab.search)

  app.route('/rate_dish')
    .put(dish.rate_dish_by_id_user)
  
  app.route('/get_most_post')
    .get(cooklab.get_most_post_user)

  app.route('/get_most_trophy')
    .get(cooklab.get_most_trophy_user)

  app.route('/get_most_rank')
    .get(cooklab.get_most_rank_user)

  app.route('/delete_all_comment')
    .delete(posting.delete_all_comment)

  app.route('/delete_all_dish')
    .delete(dish.delete_all_dish)

  app.route('/get_trophy_dish')
    .get(user.count_trophy_and_dish)

  app.route('/get_comment_by_post')
    .get(posting.get_comment_by_post_id)
};