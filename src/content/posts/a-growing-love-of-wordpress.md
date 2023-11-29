---
title: 'A Growing Love for WordPress'
publishedAt: 2023-11-29
description: "How I'm using WP REST API"
slug: 'a-growing-love-for-wordpress.md'
isPublish: true
---

![Best WordPress Memes 2023 - mycodelesswebsite.com](https://a4h6c5c5.rocketcdn.me/wp-content/uploads/2022/11/1-Developer-WordPress-Meme.jpg 'Best WordPress Memes 2023 - mycodelesswebsite.com')

### Story Time

Before becoming a developer, I used to look down on WordPress. I’d often see people’s websites were slow, bloated with plugins and forgotten themes, the sites were large and prone to vulnerabilities. I realize now that this was due to the sample set of websites that I was exposed to.

Now as a developer, I’m seeing that for the common person, small marketing teams, small businesses, anyone who has the right know-how, these sites are perfect, and powerful. As of 4 months ago I’ve recently learned how to consume API and use them to perform work, retrieve helpful data, or mutate data from third parties.

Recently while working with a client, who happens to have a WordPress site and a Shopify site, wanted the content that was showing in their WordPress site, to show up on the carousel on their Shopify site.

At first there was an idea to mimic the content on the WordPress site (Blog Post Images, URLs, and maybe titles), and create carousel posts that has that information. But then, the idea came up, “I wonder if WordPress has an API”. What if we could just contact the WordPress site, and get the information that we need to populate on the carousel?

### Surprise, Surprise

And lo and behold, WordPress has done it. It turns out every WordPress just ships with [access to an API](https://developer.wordpress.org/rest-api/). And it’s actually pretty sophisticated. It comes with Pagination, Parameters (to search, retrieve, and update very particular fields and meta data), and a few other features that I haven’t done my homework in yet. Additionally, looking at the reference guide, it looks like the API has access to either every part or almost every part of the WordPress site.

I’m surprised, this is such a powerful feature in my opinion that doesn’t get talked about enough. And I’m curious about the possible applications for this feature outside of retrieving post data.

![Shocked Surprised GIF - From IceGif](https://media.tenor.com/Y8xt6ZfmCyQAAAAC/shocked-surprised.gif 'Shocked Surprised GIF - From IceGif')

### The Nitty Gritty

The client’s Shopify site is built using Remix, so my first step was creating a Loader Function that initiates fetching and retrieves the data that I need, their WordPress posts in this case.

So I checked out the REST API Handbook from WordPress, and found the endpoint that I’d need to contact to retrieve post information - `/wp/v2/posts`. I then wrote an asynchronous fetch request at the endpoint including the parameters for only the information that I needed.

Put everything together, and this is what the request looked like:

```javascript

export async function loader() {
  const response = await fetch(
    'https://content.theboosterbox.com/wp-json/wp/v2/posts?_fields=id,link,jetpack_featured_media_url',
  );
  ...
```

The response should look something like:

`[{"id":194,"link":"https:\/\/content.theboosterbox.com\/2023\/11\/21\/tcg-news\/","jetpack_featured_media_url":"https:\/\/i0.wp.com\/content.theboosterbox.com\/wp-content\/uploads\/2021\/09\/agency6-ourworks-pic3.webp?fit=%2C&ssl=1"},{"id":132,"link":"https:\/\/content.theboosterbox.com\/2023\/11\/14\/test-2\/","jetpack_featured_media_url":""},{"id":129,"link":"https:\/\/content.theboosterbox.com\/2023\/11\/14\/test-1\/","jetpack_featured_media_url":""},{"id":1,"link":"https:\/\/content.theboosterbox.com\/2021\/09\/19\/hello-world\/","jetpack_featured_media_url":""}]`

Then, I deserialized the response object, which to my understanding uses the JSON method to format the object in such a way that Javascript is able to work with the data. This is the response after the .json() method is used on the response object:

```json
[
  {
    "id": 194,
    "link": "https://content.theboosterbox.com/2023/11/21/tcg-news/",
    "jetpack_featured_media_url": "https://i0.wp.com/content.theboosterbox.com/wp-content/uploads/2021/09/agency6-ourworks-pic3.webp?fit=%2C&ssl=1"
  },
  {
    "id": 132,
    "link": "https://content.theboosterbox.com/2023/11/14/test-2/",
    "jetpack_featured_media_url": ""
  },
  {
    "id": 129,
    "link": "https://content.theboosterbox.com/2023/11/14/test-1/",
    "jetpack_featured_media_url": ""
  },
  {
    "id": 1,
    "link": "https://content.theboosterbox.com/2021/09/19/hello-world/",
    "jetpack_featured_media_url": ""
  }
]
```

After that was completed, I mapped over the array so that it would play nicely with React, and passed it to the page as a variable called “data”.

```javascript
const data = jsonResponse.map((post) => {
  return {
    key: post.id,
    imageUrl: post.jetpack_featured_media_url,
    link: post.link
  }
})
```

As I understand it, now that the Loader Function is written and is returning something, everytime the page loads, the server will handle all the calculations and functions in the loader and pass it to the page, where, I wrote a simple map to return the information that needed to be rendered on the webpage.

```javascript
export default function wpTest() {
  const posts = useLoaderData()
  return (
    <>
      {posts.map((post, i) => (
        <p key={post.key}>
          {i} -- {post.link} -- {post.imageUrl}
        </p>
      ))}
    </>
  )
}
```

This is the final product of accessing the API and rendering the information that I needed for the carousel component.

![Screenshot of the API response formatted on the clients site](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/a_growing_love_for_wordpress/wp_api_response.png 'Screenshot of the API response formatted on the clients site')

I think that the results here are basic, but they illustrate the potential of the API, just pop those return elements into a component, and you have a carousel component on the Shopify Site that mimics and updates its content whenever there is a change to the WordPress site.

All in all, I think since becoming a developer, I’m seeing more and more the power and convenience that WordPress brings, and I’m convinced that it really is the perfect solution for small businesses, marketing teams, or just anyone that needs an easily manageable web presence. The interest for me lies in the groundwork that WordPress has laid for these companies and teams - if ever there is a need for some sophisticated or robust feature to be made from the ground up they really have made it easy on the developers.

![So Much Win Picard - memegenerator.net](https://i.pinimg.com/550x/30/11/58/3011581476eb65b619ef86c761267a5b.jpg 'So Much Win Picard - memegenerator.net')

---

### Thank you!

For spending a few minutes with me on my journey. If you have any thoughts on my work, or have any learning resources for WordPress and developing WordPress sites, I’d love to hear from you! You can send me an email at - anthony.john.medina@gmail.com
