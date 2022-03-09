'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML)
}

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  // console.log(event);
  console.log('Link was clicked!');
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll("a.active");
  for(let link of activeLinks){
    link.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  // Dlaczego to nie działa: const activeArticles = document.querySelectorAll('.post .active');
  const activeArticles = document.querySelectorAll('article.active');
  for(let activeArticle of activeArticles){    
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  
  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector)
  
  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

// [DONE] module 5.4

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post .post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors',
  optAuthorsCloudClassPrefix = 'author-size-',
  optAuthorsCloudClassCount = 3
  ;

function generateTitleLinks(customSelector = ''){
  console.log(customSelector);
  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  console.log(titleList);

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    for(let article of articles){
      /* get the article id */
      const articleId = article.getAttribute('id');
      console.log('articleId', articleId);
      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      console.log(articleTitle);
      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      console.log('linkHTML', linkHTML);
      // const linkHTMLData = {id: articleId, title: articleTitle};
      // const linkHTML = templates.articleLink(linkHTMLData);
      /* insert link into html variable */
      html = html + linkHTML;
    }
    /* insert link into titleList */
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    console.log(links);
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
}
generateTitleLinks();

function calculateTagsParams(tags){
  const params = { max: 0, min: 999999 };
  for (let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
    console.log(tag + " is used " + tags[tag] + " times");
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  
  return optCloudClassPrefix + classNumber;
}
function calculateAuthorClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optAuthorsCloudClassCount - 1) + 1);
  
  return optAuthorsCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags)
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for( let tag of articleTagsArray){
      console.log(tag)
      /* generate HTML of the link */
      const linkHTML = '<a class="tag-size-X" href="#tag-' + tag + '"><span>' + tag + '</span></a> ';
      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(linkHTML)){
        /* [NEW] add generated code to allTags array */
        allTags[linkHTML] = 1;
      } else {        
        allTags[linkHTML]++;
      }
      
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  console.log(allTags)
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log(tagsParams)
  /*[new] add html variable for all links HTML code */
  let allTagsHTML = ' ';

  for (let tagLinkHtml in allTags){
    const tagClass = calculateTagClass(allTags[tagLinkHtml], tagsParams)
    allTagsHTML += tagLinkHtml.replace('tag-size-X', tagClass );
  }
  console.log(allTagsHTML)
  
  tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let tag of activeTags){
    /* remove class active */
    tag.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinksHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinksHref){
    /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('.post-tags .list a');
  
  /* START LOOP: for each link */
  for(let link of links){
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  }    
  /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors(){
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* get author from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    /* generate HTML of the link */
    const linkHTML = '<a class="author-size-X" href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a> ';   
      if(!allAuthors.hasOwnProperty(linkHTML)){
        /* [NEW] add generated code to allTags array */
        allAuthors[linkHTML] = 1;
      } else {        
        allAuthors[linkHTML]++;
      }
  }
  console.log(allAuthors)
   /* find author wrapper */
  const authorWrapper = document.querySelector(optAuthorsListSelector);
  const authorsParams = calculateTagsParams(allAuthors);
  console.log(authorsParams)
  /*[new] add html variable for all links HTML code */
  let allAuthorsHTML = ' '; 
  for (let authorLinkHtml in allAuthors){
    const authorClass = calculateTagClass(allAuthors[authorLinkHtml], authorsParams)
    allAuthorsHTML += authorLinkHtml.replace('author-size-X', authorClass );
  }
    /* insert HTML of all the links into the tags wrapper */
    authorWrapper.innerHTML = allAuthorsHTML;
}

generateAuthors();

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for(let author of activeTags){
    /* remove class active */
    author.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const authorLinksHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let authorLink of authorLinksHref){
    /* add class active */
    authorLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  /* find all links to authors */
  const articleLinks = document.querySelectorAll('.post-author a');
  
  /* START LOOP: for each link */
  for(let link of articleLinks){
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
  }

  /* END LOOP: for each link */
}

addClickListenersToAuthors();

function addClickListenersToTagsCloud(){
  /* find all links to tags */
  const links = document.querySelectorAll('.list.tags a');
  console.log(links)
  
  /* START LOOP: for each link */
  for(let link of links){
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  }    
  /* END LOOP: for each link */
}

addClickListenersToTagsCloud();

function addClickListenersToAuthorsCloud(){
  /* find all links to authors */
  const articleLinks = document.querySelectorAll('.list.authors a');
  
  /* START LOOP: for each link */
  for(let link of articleLinks){
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
  }

  /* END LOOP: for each link */
}

addClickListenersToAuthorsCloud();