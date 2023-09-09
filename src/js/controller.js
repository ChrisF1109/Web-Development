import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import icons from 'url:../img/icons.svg';
// import icons from '../img/icons.svg';
import 'core-js';
import 'regenerator-runtime/runtime';

import view from './views/View';
import { async } from 'regenerator-runtime';
import bookmarksView from './views/bookmarksView.js';

// console.log(icons);
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// 主菜单页面显示
const controlRecipes = async function () {
  try {
    // 地址栏截取id,去除默认添加的 #
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //  1. 选择数据进行显示
    resultsView.update(model.getSearchResultsPage());
    //  2. 更新书签
    bookmarksView.update(model.state.bookmarks);
    //  3. 加载菜单
    await model.loadRecipe(id);
    //  4. 渲染菜单
    recipeView.rendar(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// 搜索页面显示
const controlSearchResults = async function () {
  try {
    // 监视器
    resultsView.renderSpinner();
    // 1. 获取输入信息
    const query = searchView.getQuery();
    if (!query) return;

    // 2. 结果加载
    await model.loadSearchResults(query);

    // 3. 结果渲染
    resultsView.rendar(model.state.search.results);

    // 4. 分页按钮
    paginationView.rendar(model.state.search);
    // TEST: 菜单点击测试内容数据
    // function clickTest() {
    //   document.querySelectorAll('.results').forEach(res =>
    //     res.addEventListener('click', function (e) {
    //       console.log(model.state.search.results);
    //     })
    //   );
    // }
    // clickTest();
  } catch (err) {
    console.error(err);
  }
};

// 分页控制显示
const controlPagination = function (goToPage) {
  // 新页面加载
  resultsView.rendar(model.getSearchResultsPage(goToPage));

  // 分页按钮显示
  paginationView.rendar(model.state.search);
};

// 添加内容标签
const controlAddBookmark = function () {
  // 1. 添加/移除标签
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. 更新页面显示
  recipeView.update(model.state.recipe);

  // 3. 加载书签
  bookmarksView.rendar(model.state.bookmarks);
};

// 标签显示
const controlBookmarks = function () {
  bookmarksView.rendar(model.state.bookmarks);
};

// 人数修改（对应食材的数量）
const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

// 函数调用集合
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  // addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
