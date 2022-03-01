import { Component, OnInit } from '@angular/core';
import {Post} from "../../models/Post";
import {PostService} from "../../service/post.service";
import {NotificationService} from "../../service/notification.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {CommentService} from "../../service/comment.service";

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  posts: Post[];
  isPostsLoaded = false;

  constructor(private postService: PostService,
              private notificationService: NotificationService,
              private imageService: ImageUploadService,
              private commentService: CommentService) { }

  ngOnInit(): void {
    this.postService.getPostForCurrentUser()
      .subscribe(data =>{
        console.log(data);
        this.posts = data;
        this.getImagesToPosts(this.posts);
        this.getCommentToPosts(this.posts);
        this.isPostsLoaded = true;
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

  getCommentToPosts(posts: Post[]): void{
    posts.forEach(p => {
      this.commentService.getCommetsToPost(p.id!)
        .subscribe(data =>{
          p.comments = data;
        });
    });
  }

  formatImage(img: any): any{
    if(img == null){
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }


  removePost(post: Post, index: number): void{
    console.log(post);
    const result = confirm('Do you really want to delete post?');
    if(result){
      this.postService.deletePost(post.id!)
        .subscribe(data => {
          this.posts.splice(index, 1);
          this.notificationService.showSnackBar("Post deleted", 'Done');
      });
    }
  }


  deleteComment(commentId: number, postIndex: number, commentIndex: number): void{
    const post = this.posts[postIndex];
    this.commentService.delete(commentId)
      .subscribe(() => {
        this.notificationService.showSnackBar('Comment deleted', 'done');
        post.comments!.splice(commentIndex, 1);
      });

  }

}
