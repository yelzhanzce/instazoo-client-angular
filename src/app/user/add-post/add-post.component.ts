import { Component, OnInit } from '@angular/core';
import {PostService} from "../../service/post.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../service/notification.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  public addPostForm: FormGroup;
  selectedImageToPost: File;
  previewImgURL: any;

  constructor(private postService: PostService,
              private fb: FormBuilder,
              private notificationService: NotificationService,
              private imageService: ImageUploadService,
              private router: Router) { }

  ngOnInit(): void {
    this.addPostForm = this.createAddPostForm();
  }

  createAddPostForm(): FormGroup{
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      caption: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
    })
  }

  submit(): void{
    this.postService.createPost({
      title: this.addPostForm.value.title,
      caption: this.addPostForm.value.caption,
      location: this.addPostForm.value.location
    }).subscribe(data =>{
      this.onUpload(data.id);
    });


  }

  onFileSelected(event: any): void{
    this.selectedImageToPost = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedImageToPost);
    reader.onload = () =>{
      this.previewImgURL = reader.result;
      console.log(this.previewImgURL);
    };
  }

  formatImage(img: any): any{
    if(img == null){
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  onUpload(postId: number): void{
    if(this.selectedImageToPost != null){
      this.imageService.uploadImageToPost(this.selectedImageToPost, postId)
        .subscribe(() =>{
          this.notificationService.showSnackBar('Post successfully created', 'done!')
          this.router.navigate(['/profile']);
          // window.location.reload();
        });
    }
  }

}
