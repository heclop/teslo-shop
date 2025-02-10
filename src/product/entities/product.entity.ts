import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'products'})
export class Product {

    @ApiProperty({
        example: '115e4a92-21c0-4acd-9e55-32f62227dca4',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Prouduct Price',
    })
    @Column('float', {
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: 'hsnndbndns jsjsnmerndnmdns jsjsjuejsdnsnsn hjsjsjed',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({
        example: 't-shirt teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example: ['M','XL','XXL','S'],
        description: 'Product size',
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[];


    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        ( productImage ) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {

        if (!this.slug) {

            this.slug = this.title
        }

        this.slug = this.title
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');

    }

    // @BeforeUpdate()
    @BeforeUpdate()
    checkSlugUpdate() {


        this.slug = this.title
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');

    }

}
