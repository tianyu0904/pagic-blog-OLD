export default {
    srcDir: 'src',
    theme: 'blog',
    plugins: ['blog'],
    title: '小宇的技术博客',
    description: '欢迎来到我的博客，这里分享了一些学习笔记和技术文章，欢迎一起交流。',
    blog: {
        root: '/posts/',
        social: {
            github: 'https://github.com/tianyu666',
            email: 'tianyu8125@163.com',
        },
    },
    nav: [
        {
            text: '首页',
            link: '/index.html',
            icon: 'czs-home-l',
        },
        {
            text: '分类',
            link: '/categories/index.html',
            icon: 'czs-category-l',
        },
        {
            text: '标签',
            link: '/tags/index.html',
            icon: 'czs-tag-l',
        },
        {
            text: '归档',
            link: '/archives/index.html',
            icon: 'czs-box-l',
        },
        {
            text: '关于',
            link: '/about/index.html',
            icon: 'czs-about-l',
        },
        {
            text: '友情链接',
            link: '/links/index.html',
            icon: 'czs-link-l',
        },
    ],
};
