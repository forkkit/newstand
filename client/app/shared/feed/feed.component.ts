import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  feedItems = [];
  
  constructor() { }

  ngOnInit() {

    this.feedItems = [
      {
        actor: 'mainer4life',
        actor_img: 'assets/user_placeholder.jpg',
        verb: 'applied',
        object: 'label on',
        icon: 'fa fa-tag',
        target: 'Portland Press Herald',
        target_possessive: 'article',
        time: 'a day ago',
        detail: 'The extent of damage or injuries was not immediately clear, but people fled office buildings along the central Reforma Avenue.',
        detail_type: 'quote',
        label_type: 'source'
      },
      {
        actor: 'debbie_smith',
        actor_img: 'assets/user_placeholder.jpg',
        verb: 'applied',
        object: 'label on',
        icon: 'fa fa-tag',
        target: 'Bangor Daily News',
        target_possessive: 'article',
        time: '2 days ago',
        detail: 'McGovern’s youthful experimentations in brewing turned into a lifelong passion and, eventually, a career',
        detail_type: 'quote',
        label_type: 'explaination'
      },
      {
        actor: 'shawn_globe',
        actor_img: 'assets/user_placeholder.jpg',
        verb: 'closed',
        object: 'label on',
        icon: 'icon-tag_accept',
        target: 'boston_globe/labels/#2345',
        target_possessive: '',
        time: '2 days ago',
        detail: 'Source provided directly after referenced item',
        detail_type: '',
        label_type: ''
      },
      {
        actor: 'born2write',
        actor_img: 'assets/user_placeholder.jpg',
        verb: 'commented on',
        object: 'label',
        icon: 'fa fa-comment-o',
        target: 'seacoastonline/labels/#65',
        target_possessive: '',
        time: '3 days ago',
        detail: 'We were able to break this story first because of a tip received on our FB page!',
        detail_type: '',
        label_type: ''
      }
    ]
  }
}
