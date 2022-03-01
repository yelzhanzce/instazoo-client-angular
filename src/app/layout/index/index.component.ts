import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";
import {User} from "../../models/User";
import {UserService} from "../../service/user.service";
import {PostService} from "../../service/post.service";
import {CommentService} from "../../service/comment.service";
import {NotificationService} from "../../service/notification.service";
import {ImageUploadService} from "../../service/image-upload.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isPostsLoaded = false;
  posts: Post[];
  isUserDataLoaded = false;
  user: User;

  constructor(private userService: UserService,
              private postService: PostService,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private imageService: ImageUploadService) { }

  ngOnInit(): void {
    this.postService.getAllPosts()
      .subscribe(data =>{
        console.log(data);
        this.posts = data;
        this.getCommentsToPost(this.posts);
        this.getImagesToPosts(this.posts);
        this.isPostsLoaded = true;
      });

    this.userService.getCurrentUser()
      .subscribe(data =>{
        console.log(data);
        this.user = data;
        this.isUserDataLoaded = true;
      });
  }

  getImagesToPosts(posts: Post[]): void{
    posts.forEach(p => {
      this.imageService.getImageToPost(p.id!)
        .subscribe(data =>{
          p.image = data.imageBytes;
        });
    });
  }

  getCommentsToPost(posts: Post[]): void{
    posts.forEach(p =>{
      this.commentService.getCommetsToPost(p.id!)
        .subscribe(data =>{
          p.comments = data;
        });
    });
  }

  likePost(postId: number, postIndex: number): void{
    const post = this.posts[postIndex];
    console.log(post);

    if(!post.usersLiked!.includes(this.user.username)){
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {
          post.usersLiked!.push(this.user.username);
          post.likes = post.likes! + 1;
          this.notificationService.showSnackBar('Liked!', 'Done');
        });
    }else{
      this.postService.likePost(postId, this.user.username)
        .subscribe(() =>{
          const index = post.usersLiked!.indexOf(this.user.username, 0);
          if(index > -1){
              post.usersLiked!.splice(index, 1);
              post.likes = post.likes! - 1;
          }
        });
    }
  }

  postComment(message: string, postId: number, postIndex: number): void{
    const post = this.posts[postIndex];
    console.log(post);
    this.commentService.addToCommentToPost(postId, message)
      .subscribe(data =>{
        console.log(data);
        post.comments!.push(data);
      });
  }


  formatImage(img: any): any{
    if(img == null){
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

}
