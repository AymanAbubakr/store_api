const AppError = require('../utils/appError');
const DB = require('../utils/connection');
const knex = require('../db/knex');
const catchasync = require('../utils/CatchAsync');

exports.getCalculation = catchasync(async (req, res, next) => {
  /**
   * ! we use these two fields to make a recommendation system that discount the product base the information that we get form the user .
   * ! so that we have high change to sell more product beause we discount almost those products that user preferre.
   */
  if (!req.body.gender || !req.body.categoryId)
    return next(new AppError('Please fill require fields', 400));

  let result = await knex
    .select('ca.*', knex.raw('SUM(product.price) as total'))
    .from('category AS ca')
    .join('product', 'ca.id', 'product.categoryId')
    .groupBy('ca.id');

  //! an object of stores and there categorys

  let joinResult = await knex
    .select(
      'store.id',
      'store.name',
      knex.raw('group_concat(ca.id) as categorys')
    )
    .from('store_category as sc')
    .join('store', 'sc.store_id', 'store.id')
    .join('category as ca', 'sc.category_id', 'ca.id')
    .groupBy('store.id');

  joinResult.forEach((element) => {
    element.categorys = element.categorys.split(',');
    let sum = 0;
    result.forEach((each) => {
      if (element.categorys.includes(each.id.toString())) {
        sum += each.total;
        for (let index = 0; index < element.categorys.length; index++) {
          if (element.categorys[index] == each.id.toString()) {
            element.categorys[index] = each;
            break;
          }
        }
      }
    });
    element['Store Total'] = sum;
  });

  res.status(200).json({
    status: 'success',
    result: joinResult,
  });
});

//! also calculating discount.
// exports.getCalculation = (req, res, next) => {
//   /**
//    * ! we use these two fields to make a recommendation system that discount the product base the information that we get form the user .
//    * ! so that we have high change to sell more product beause we discount almost those products that user preferre.
//    */
//   if (!req.body.gender || !req.body.categoryId)
//     return next(new AppError('Please fill require fields', 400));

//   let query = 'SELECT * FROM store_category';
//   DB.query(query, (err, result) => {
//     if (err) return next(err);
//     //! an object of stores and there categorys
//     let StoresAndCategorysId = {};
//     result.forEach((element) => {
//       if (StoresAndCategorysId.hasOwnProperty(element.store_id)) {
//         return (StoresAndCategorysId[element.store_id] = [
//           ...StoresAndCategorysId[element.store_id],
//           element.category_id,
//         ]);
//       }
//       //key & value
//       StoresAndCategorysId[element.store_id] = [element.category_id];
//     });

//     ////////////////////////////////?

//     query = 'SELECT * FROM product';
//     DB.query(query, (error, proResult) => {
//       if (error) return next(error);

//       let totalOfProductForEachCategory = {};
//       let productsAfterDiscont = [];
//       const GENDER_DISCOUNT = 0.15;
//       const CATEGORY_DISCOUNT = 0.1;

//       proResult.forEach((element) => {
//         //* calculating total WITH discount
//         let obj = {};
//         obj.productName = element.name;
//         obj.orginalPrice = element.price;
//         if (
//           req.body.gender === element.preferredBy &&
//           req.body.categoryId.includes(element.categoryId)
//         ) {
//           obj.discountedPrice =
//             element.price -
//             element.price * (GENDER_DISCOUNT + CATEGORY_DISCOUNT);
//         } else if (req.body.gender === element.preferredBy) {
//           obj.discountedPrice = element.price - element.price * GENDER_DISCOUNT;
//         } else {
//           obj.discountedPrice =
//             element.price - element.price * CATEGORY_DISCOUNT;
//         }
//         productsAfterDiscont.push(obj);
//         //* calculating total WITH OUT discount
//         if (totalOfProductForEachCategory.hasOwnProperty(element.categoryId)) {
//           return (totalOfProductForEachCategory[element.categoryId] +=
//             element.price);
//         }
//         totalOfProductForEachCategory[element.categoryId] = element.price;
//       });

//       ////////////////////////////////?

//       //! an object that containes stores all categorys and total prices of each category
//       let totalResult = {};
//       for (const key in StoresAndCategorysId) {
//         for (const categoryKey in totalOfProductForEachCategory) {
//           if (StoresAndCategorysId[key].includes(parseInt(categoryKey))) {
//             let obj = {};
//             obj[categoryKey] = totalOfProductForEachCategory[categoryKey];
//             if (totalResult.hasOwnProperty(key)) {
//               totalResult[key] = [...totalResult[key], obj];
//             } else {
//               totalResult[key] = [obj];
//             }
//           }
//         }
//       }

//       ////////////////////////////////?

//       //! finding total of a store
//       for (const key in totalResult) {
//         let sum = 0;
//         totalResult[key].forEach((eachStore) => {
//           sum += Object.values(eachStore)[0];
//         });
//         totalResult[key] = [...totalResult[key], { 'Total Of Store': sum }];
//       }

//       ////////////////////////////////?

//       query = 'SELECT * FROM store';
//       DB.query(query, (storeError, storeResult) => {
//         if (storeError) return next(storeError);

//         //! it will change the ids of stores to there real name
//         let existingStoreKeys = Object.keys(totalResult);
//         let keysLength = existingStoreKeys.length;
//         for (let index = 0; index < storeResult.length; index++) {
//           const store = storeResult[index];
//           if (keysLength == 0) {
//             break;
//           }
//           if (existingStoreKeys.includes(store.id.toString())) {
//             totalResult[store.name] = totalResult[store.id.toString()];
//             delete totalResult[store.id.toString()];
//             keysLength--;
//           }
//         }

//         ////////////////////////////////?

//         query = 'SELECT * FROM category';
//         DB.query(query, (categoryError, categoryResult) => {
//           if (categoryError) return next(categoryError);
//           //! it will name of each category
//           for (const key in totalResult) {
//             totalResult[key].forEach((eachCategory) => {
//               for (let index = 0; index < categoryResult.length; index++) {
//                 const element = categoryResult[index];
//                 if (element.id.toString() === Object.keys(eachCategory)[0]) {
//                   eachCategory['Category Name'] = element.name;
//                   break;
//                 }
//               }
//             });
//           }

//           ////////////////////////////////?

//           res.status(200).json({
//             status: 'success',
//             result: totalResult,
//             productsAfterDiscont,
//           });
//         });
//       });
//     });
//   });
// };
