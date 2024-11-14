import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-not-found',
  templateUrl: './404.page.component.html'
})
export class NotFoundComponent implements OnInit {

  ngOnInit(): void {
    this.animateCogs();
    this.animateText();
  }

  private animateCogs(): void {
    gsap.to(".cog1", {
      transformOrigin: "50% 50%",
      rotation: "+=360",
      repeat: -1,
      ease: "none",
      duration: 8
    });

    gsap.to(".cog2", {
      transformOrigin: "50% 50%",
      rotation: "-=360",
      repeat: -1,
      ease: "none",
      duration: 8
    });
  }

  private animateText(): void {
    gsap.fromTo(".wrong-para", {
      opacity: 0
    }, {
      opacity: 1,
      duration: 1,
      stagger: {
        repeat: -1,
        yoyo: true
      }
    });
  }
}