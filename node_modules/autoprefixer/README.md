# Autoprefixer

<img align="right" width="94" height="71"
     src="https://postcss.github.io/autoprefixer/logo.svg"
     title="Autoprefixer logo by Anton Lovchikov">

[PostCSS] plugin to parse CSS and add vendor prefixes to CSS rules using values
from [Can I Use]. It is recommended by Google and used in Twitter and Alibaba.

Write your CSS rules without vendor prefixes (in fact, forget about them
entirely):

```css
::placeholder {
  color: gray;
}

.image {
  width: stretch;
}
```

Autoprefixer will use the data based on current browser popularity and property
support to apply prefixes for you. You can try the [interactive demo]
of Autoprefixer.

```css
::-moz-placeholder {
  color: gray;
}
::placeholder {
  color: gray;
}

.image {
  width: -moz-available;
  width: -webkit-fill-available;
  width: stretch;
}
```

Twitter account for news and releases: [@autoprefixer].

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Autoprefixer is built by <b><a href="https://evilmartians.com/">Evil Martians</a></b>, an American design and engineering consultancy for <b>developer tools, AI, and cybersecurity startups</b>.

---

[interactive demo]: https://autoprefixer.github.io/
[@autoprefixer]: https://twitter.com/autoprefixer
[Can I Use]: https://caniuse.com/
[PostCSS]: https://github.com/postcss/postcss

## Docs
Read full docs **[here](https://github.com/postcss/autoprefixer#readme)**.
