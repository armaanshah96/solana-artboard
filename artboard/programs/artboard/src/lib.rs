use anchor_lang::prelude::*;

declare_id!("CjK9Rwj3evef88G411QsUTdihVm63DRfgLEpgYFXG1Q4");

#[program]
pub mod artboard {
    use super::*;
    pub fn start(ctx: Context<Board>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_images = 0;
        Ok(())
    }
    
    pub fn add_image(ctx: Context<AddImage>, image_url: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;

        let item = ItemStruct{
            image_url: image_url.to_string(),
            user_address: *base_account.to_account_info().key,
        };

        base_account.image_list.push(item);
        base_account.total_images += 1;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Board<'info> {
    // init -> Solana should staart a new account owned by the program
    // payer=user means person calling fn
    // space is the bytes allocated to the program
    #[account(init, payer=user, space=9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct AddImage<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub image_url: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_images: u64,
    pub image_list: Vec<ItemStruct>,
}