---
title: 'Using AWS CloudFront to Speedup My App'
publishedAt: 2023-12-01
description: 'Revisiting Playtimer.'
slug: 'revisiting-playtimer.md'
isPublish: true
---

![What is a content delivery network (CDN) - Cloudflare Infographic](https://cf-assets.www.cloudflare.com/slt3lc6tev37/7Dy6rquZDDKSJoeS27Y6xc/4a671b7cc7894a475a94f0140981f5d9/what_is_a_cdn_distributed_server_map.png 'What is a content delivery network (CDN) - Cloudflare Infographic')

---

This post is a continuation of [The Making of Playtimer (Part 4)](https://anthonyjmedina.com/posts/the-making-of-playtimer-4.md/).

Checkout the final project [here](https://playtimer.anthonyjmedina.com/).

---

> The reason that I did this was for future-proofing. Maybe when I learn about it, or if I actually end up needing it, I’d want to have a bucket set up already that can eventually be connected to Amazon’s CDN, AWS Cloudfront, reducing the overall TTL of the site and it’s resources.

Back in late October, I had finally finished the Playtimer App, and as someone whose goal it is to know when/how to leverage AWS Services to compliment development, I knew that this was the opportunity to finally play around with some more AWS Services. In this case, AWS CloudFront.

### What is CloudFront?

AWS CloudFront is Amazon's Content Delivery Network. A content delivery network (CDN) is a network of interconnected servers that cache and clone content from one part of the network (the origin) and caches that content to the rest of the network (edge locations). The advantage of CDN's is that these networks reach all sorts of geographic locations. For scale, AWS has edge locations or servers that are all interconnected in almost every part of the world.

![How Big Is Planet Earth - worldatlas.com](https://www.worldatlas.com/r/w1200/upload/ea/6a/8a/shutterstock-291347969.jpg 'How Big Is Planet Earth - worldatlas.com')

This means that if I host my content in Northern Virginia, you live in Osaka, Japan, and there is an edge location near you - the CDN is going to serve the content as if it's hosted in Osaka, significantly reducing the time to load of my content to your browser/client.

### Why Playtimer?

Playtimer is great, but because I hosted these fairly large background images off of S3, whenever a person creates a timer, there's a lag between the creation of the timer, and the rendering of the background image. And to me, this takes away from the experience a little bit. So I want to see if we can speed up that resource load time to make using the app a little bit more seamless for my users.

### The Experiment

Today I happened to be working out of a coffee shop, and I noticed that load speeds for the app were a little bit slower than what I'm usually used to. So I decided to get some stats on my connection speed mostly for you, the readers, who might know more about the internet than I do. And I felt like, with any good experiment, it's important to record the environment that the experiment is taking place in.

To start off, I went to [CloudFlare](https://www.cloudflare.com/) (another major player who offers a great CDN) who for years I used to pass my WordPress websites DNS through this CDN because of it's ease of use, and ran a speed test on my connection settings and put the results below:

![Screenshot of Cloudflare Connection Test](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/using_cloudfront/connection-test.png 'Screenshot of Cloudflare Connection Test')

Next, I brought up the website and loaded up a couple of the timers, and used Firefox's Dev Tools to look at the Network Inspector, and recorded some of the load times for these timer background images:

![Screenshot of Firefox Dev Tools](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/using_cloudfront/inspecting-load-times.png 'Screenshot of Firefox Dev Tools')

---

| Timer Background | Time To Load |
| :--------------: | :----------: |
|   onepiece.png   |    12.44s    |
|   lorcana.png    |    2.70s     |
|     mtg.png      |    2.41s     |
|  dragonball.png  |    12.74s    |

---

This brings the average load time of images (based on this data set) to 7.57s.

The idea is that we distribute the images from a Cloudfront Distribution, which should disseminate the content to various edge locations that are nearest to me using the most optimized network path that AWS could offer.

### Setting Up CloudFront

First I signed into AWS, and navigated to AWS CloudFront. After that I clicked on "Create Distribution, selected "Origin Domain" and selected the name of the S3 Bucket I wanted to put through CloudFront `playtimer-images.s3amazonaws.com`, the one that I set up weeks ago in anticipation of this workflow.

![Screenshot of Screenshot of CloudFront Console](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/using_cloudfront/cloudfront-distribution-name.png 'Screenshot of CloudFront Console')

I mostly stuck with all of the defaults within that console, changing only a few that aren't of import but should help me avoid paying extra if for some reason use of playtimer ever picked up. I added a description to the distribution to help me identify what this distribution is doing, and then went on a coffee break because these distributions take an eternity to deploy to all of the edge locations.

![Screenshot of Screenshot of CloudFront Deploy](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/using_cloudfront/cloudfront-deploy.png 'Screenshot of CloudFront Deploy')

After waiting for the deploy to finish, I tested to see if I could access the Distributions Domain Name - https://d2v9ou34ah9m2h.cloudfront.net/bss.png, and there it is, Battle Spirits Saga card art is rendering.

![Screenshot of Screenshot of CloudFront Test](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/using_cloudfront/cloudfront-test.png 'Screenshot of CloudFront Test')

Next, I went back to the code base, updated the Source URL's for all of the Timer Components Variants, and pushed my changes up to Netlify, where changes were being watched for automatically triggering a rebuild. Once the deployment was finished building there, I went back to the site, and re render the images, onepiece.png, lorcana.png, mtg.png, and dragonball.png, so that those images can get cached in CloudFront.

![Screenshot of New Timers Being Tested](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/using_cloudfront/new-timers-render.png 'Screenshot of New Timers Being Tested')

After caching the images for testing, I went to a new browser, brought up the website, and a new console, and recorded the new upload times. Here are the results:

![Screenshot of New Timers Test Results](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/using_cloudfront/inspecting-load-times-new.png 'Screenshot of New Timers Test Results')

---

| Timer Background | Time To Load |
| :--------------: | :----------: |
|   onepiece.png   |    1.60s     |
|   lorcana.png    |    2.80s     |
|     mtg.png      |    3.70s     |
|  dragonball.png  |    5.21s     |

---

### Conclusions of CloudFront Tests

I'm seeing a couple of things happen, that I'm not sure why it's happening, and honestly, would love someone to tell me how to test further or gather further information.

First, I'm noticing that images such as `lorcana.png` and `mtg.png`, are loading a little bit longer than when they were not going through a CDN. The difference to me is marginal because of my next observation. Images like `onepiece.png` and `dragonball.png` went from loading in the 12s to 1s - 5s.

After comparing the two test results, I found that on average, the images loaded 43% faster, with an average load time of 3.32s, when they were served through CloudFront. A much needed improvement to the load times of such critical components of the app!

![Redline Racing GIF - tenor.com](https://media.tenor.com/GxwW8eS2RY8AAAAC/redline-racing.gif 'Redline Racing GIF - tenor.com')

I would say, this was a successful undertaking this particular use case. I think maybe in the future, I’d want to include the images in the actual code base, and put the whole site through CloudFront. But, I think this was a good detour to explore the actual effects of CloudFront.

---

| Avg Time To Load Before CloudFront | Avg Time To Load After CloudFront |
| :--------------------------------: | :-------------------------------: |
|               7.57s                |               3.32s               |

---

### Housekeeping

Lastly, I had got some user feedback from folks who were using the timer to help run their tournaments, advising of the Pause/Reset Button acting a little funky. I made the changes a few days ago and am just now thinking of documenting it, so the explanations might be a little unspecific.

I replicated the behavior:

1. The state for being paused and expired weren’t properly being toggled when the onClickReset function is triggered. Rather than using the “logical not” operator for those states, I hard coded the states as they should be when the function is triggered, that is, when a user clicks the reset button, the isPaused and isExpired states should be changed to false.

2. I’m not fully sure as to why it was happening, but when a user clicked reset, the timer state would be set to one second after the initialTime value. So to ensure that the timer returns to the initialTime, I just passed the InitialTime into the setTimer state method.

Additionally, for UX, I wanted another state to indicate that the timer hadn't expired, but it also wasn’t active.

Before when the timer was paused or expired, both the border and the background would be changed, that is, the box shadow (the glow) was removed, and the border color was set to a gray.
To create a median state or just something that was between active and expired, I decided to just remove the box shadow, this way the timers still looked as though they had an “energy” about them. It reminds me of buttons, when they are inactive they are completely grayed out, vs when they are just not active, they still have color, but maybe the text or border colors are just not as bright as the hover or active states.

To achieve this effect I updated the box shadow prop of the Chakra UI Box that the timer is currently made out of, adding a “logical or” operator and passing the isPaused is truthy condition in the ternary operator.

```javascript
  boxShadow={
         isExpired || isPaused ? "none" : `6px 6px 32px 11px ${boxShadow}`
       }
```

So the code now reads - “For the boxShadow prop, is the timer expired or is it paused? If yes, the value of boxShadow is none. Else (if it’s neither paused or expired), the value of the boxShadow is now `6px 6px 32px 11px ${boxShadow}` - with ${boxShadow} being the respective rgba value of the card game associated with this timer.

### All In All

I had a lot of fun messing around with AWS CloudFront, previously working in Web Hosting, I would often recommend people putting their websites through a CDN like CloudFlare and AWS CloudFront, but had never had the opportunity to actually use CloudFront. And finally peeling back the curtains and playing around with it, with an app that I created and seeing real tangible results just makes the whole detour worth it to me.

And I can't say enough about testing your apps and getting user feedback. Users may not always know what they want, or know how to create good UX, but they definetly know what they don't like, and are so thorough in their feedback for either a feature that they don't like, or some bug that's on your app.

![Gotta Go Fast Meme](https://i.pinimg.com/originals/ed/6d/a1/ed6da1fc2b094d168c745e19d7c9948a.gif 'Gotta Go Fast Meme')

---

### Thank you!

As always, thank you so much for spending a few minutes of your day with me, and thank you to everyone who uses [Playtimer](https://playtimer.anthonyjmedina.com/).

If you have any thoughts on my work, or have any learning resources for AWS, I’d love to hear from you! You can send me an email at - anthony.john.medina@gmail.com
