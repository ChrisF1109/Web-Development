import { API_URL, API_URL_GET, KEY, RES_PER_PAGE } from './config.js';

import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data, id) {
  const { recipe } = data;
  return {
    id: id,
    title: recipe.title,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    publisher: recipe.publisher,
    cookingTime: +recipe.cooking_time,
    // servings: +recipe.servings,
    // fake fynamic num,Just for test
    servings: 4,
    ingredients: recipe.ingredients,
    unit: 2,
  };
};

// 1. 搜索结果返回加载
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    // const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    const data = await AJAX(`${API_URL}?q=${query}`);

    // console.log(data);
    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.recipe_id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        // key: rec.key
        // ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;

    // console.log(state.search.results);
  } catch (err) {
    console.error(err);
  }
};

// 2. 页面加载
export const loadRecipe = async function (id) {
  try {
    // const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    const data = await AJAX(`${API_URL_GET}${id}`);
    // console.log(data);
    state.recipe = createRecipeObject(data, id);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 3. 分页处理
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;

  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

// 4. 本地存储
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

  // console.log(JSON.parse(localStorage.getItem('bookmarks')));
};

// 5. 添加书签
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// 6. 删除书签
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// 7. 本地获取标签
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// 8. 清空存储
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// 9. 人数控制
export const updateServings = function (newServings) {
  // state.recipe.ingredients.forEach(ing => {
  //   ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  //   // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  // });
  state.recipe.unit = (
    (state.recipe.unit * newServings) /
    state.recipe.servings
  ).toFixed(2);

  state.recipe.servings = newServings;
};
