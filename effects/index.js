const testimonialsEndpoint = "https://myautohound.com/api/getReviews";
const instanceAxios = axios.create({
});

const reqListener = (method, url) => {
  return new Promise((resolve, reject) => {
    instanceAxios({
      method: method,
      url: url,
    })
      .then((res) => {
        resolve({
          success: res.data,
        });
      })
      .catch((err) => {
        resolve({
          err: err.response.data,
        });
      });
  });
};
const getTestimonials = () => {
  return new Promise(async (res, rej) => {
    const { success, err } = await reqListener("get", testimonialsEndpoint);
    console.log(success, err);
    let fdata = [];
    if (success) {
      const arrData = success;
      if (arrData.length == 0) {
        res({ success: false, data: fdata });
      }
      arrData.forEach((data) => {
        const { review, userDealershipName, userName } = data;
        const html = Mustache.render(
          document.getElementById("testimony-template").innerHTML,
          {
            review,
            userDealershipName,
            userName,
          }
        );
        fdata.push(html);
      });
      res({ success: true, data: fdata });
    } else {
      res({ success: false, data: fdata });
    }
  });
};
const loadTestimonials = async () => {
  const data = await getTestimonials();
  if (data.success) {
    const htmlArr = data.data;
    let c_html = "";
    htmlArr.forEach((html, index) => {
      let divEle = document.createElement("div");
      if (index == 0) {
        divEle.classList.add("item", "active");
      } else {
        divEle.classList.add("item");
      }
      divEle.innerHTML = html;
      c_html += divEle.outerHTML;
    });
    const carousel = Mustache.render(
      document.getElementById("testimonial-container").innerHTML,
      {
        carousel_inner: c_html,
      }
    );
    document.getElementById("testimonials-data").innerHTML = carousel;
    $("#carousel1").carousel({
      interval: 3000,
    });
  } else {
    ifNotTestimonial();
  }
};
const ifNotTestimonial = () => {
  document.getElementById("testimonials_status").innerText =
    "No Testimonials available right now";
};

loadTestimonials();

const scrollToId = (name) => {
  const val = document.getElementById(name).offsetTop;
  const initScroll = document.getElementsByClassName("main-wrapper")[0]
    .scrollTop;
  const scrollBy = val - 95 - initScroll;
  document.getElementsByClassName("main-wrapper")[0].scrollBy(0, scrollBy);
};
