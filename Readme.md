# 5ch-fetcher

5ch fetcher

## Install

```bash
npm install 5ch-fetcher
```

## Usage

```typescript
import { BBSMenu, requestOptions, Thread } from "2ch-fetcher";
import { bbsMenuUrl5ch, fetch5chPosts } from "5ch-fetcher";

requestOptions.headers = {
    // tslint:disable-next-line max-line-length
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063",
};

async function hierarchal() {
    const menu = new BBSMenu(bbsMenuUrl5ch);
    const boards = await menu.fetchBoards();
    const threads = await boards.name("河川・ダム等").fetchThreads();
    const thread = threads.title("なんとかスレ");
    const posts = await fetch5chPosts(thread);
    const post = posts.index(1); // 1 origin
    if (post) { // あぼーん post is undefined
        console.log(post.name);
    }
    console.log(posts.indexRange(1, 2));
}

async function single() {
    const thread = new Thread("http://5ch.net/foobar/dat/123456789.dat", "title", 42);
    const posts = await fetch5chPosts(thread);
    console.log(posts.index(1));
}

hierarchal().then(single);
```

## License

This is released under [Zlib License](https://narazaka.net/license/Zlib?2018)
