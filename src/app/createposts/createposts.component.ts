import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createposts',
  templateUrl: './createposts.component.html',
  styleUrls: ['./createposts.component.scss'],
})
export class CreatepostsComponent {
  createForm!: FormGroup;
  index: number = 0;
  // postId: any;
  // localIdWithNumber!: string;
  // currentpostnumber = 0;
  constructor(
    private authservice: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  createposts(createForm: FormGroup) {
    const { title, content, images } = createForm.value; // Destructure form values
    // Validate and prepare data to send to the backend
    const postPayload = {
      title,
      content,
      imageurl: images, // Send all image URLs (array)
    };

    this.authservice
      .savePostsInfo(
        postPayload.title,
        postPayload.content,
        postPayload.imageurl
      )
      .subscribe({
        next: (res) => {
          console.log('Post created successfully:', res);
          createForm.reset(); // Reset the form after successful submission
          alert('Post created successfully!');
          this.router.navigate(['/myaccount']);
        },
        error: (err) => {
          console.error('Failed to create post:', err);
          alert('Failed to create post. Please try again.');
        },
      });
  }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      images: this.fb.array([
        this.fb.control('', Validators.required), // Initialize with one image field
      ]),
    });
  }

  get imageControls(): FormArray {
    return this.createForm.get('images') as FormArray;
  }

  addImage(): void {
    this.imageControls.push(this.fb.control('', Validators.required));
    console.log(this.imageControls.value);
  }

  removeImage(index: number): void {
    this.imageControls.removeAt(index);
  }

}
