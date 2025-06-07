"use client"
import React, {useEffect, useState} from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import {ModalClose} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import { FormControl, useFormControlContext } from '@mui/base/FormControl';
import Divider from '@mui/material/Divider';
import { Input, inputClasses } from '@mui/base/Input';
import { styled } from '@mui/system';
import TabPanel from '@mui/joy/TabPanel';
import Box from '@mui/joy/Box';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Search from '@mui/icons-material/Search';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Chip from '@mui/material/Chip';
import LoupeSharpIcon from '@mui/icons-material/LoupeSharp';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary, {
    accordionSummaryClasses,
} from '@mui/joy/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import clsx from 'clsx';
import Avatar from '@mui/joy/Avatar';
import IconButton from "@mui/joy/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import SelectJoy from "@/app/dashboard/components/joy/select";
import PersonIcon from '@mui/icons-material/Person';
import ChecklistSharpIcon from '@mui/icons-material/ChecklistSharp';
import AssignmentTurnedInSharpIcon from '@mui/icons-material/AssignmentTurnedInSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import InputNumber from "@/app/dashboard/components/joy/inputNumber";
import {AddonCard} from "@/app/dashboard/components/joy/addonCard";
import SummaryCard from "@/app/dashboard/components/joy/summaryCard";
import Button from '@mui/joy/Button';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/joy/CircularProgress';
import {Category, SubCategory} from "@interfaces/category";


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const port = process.env.NEXT_PUBLIC_PORT;


interface FormRequestProps{
    open : boolean
    idRequest  : number ,
    typeForm : "view" | "edit" | "new",
}
type Addon = {
    id: number;
    nombre: string;
    price: string;
    amount: string;
    total: string;
};
export const RequestForm: React.FC<FormRequestProps> = ({ open,  idRequest, typeForm }) => {
    
    const urlEndpoint = `${baseUrl}:${port}/request/forTableList`
    // const urlEndpoint = 'http://localhost:12099/request/forTableList'
    const [request, setRequests] = useState([]);
    const [close, setClose] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [error , setError] = useState(null);
    const [index, setIndex] = React.useState(0);
    const colors = ['primary', 'warning', 'success'] as const;
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        const category = categories.find(c => c.pkCategory.toString() === value);
        setSubCategories(category?.subCategory || []);
        setSelectedSubCategory('');
    };


    const handleClickFinalizar = () => {
        setLoadingButton(true);
        // Cambiar cuando se use el endpoint o validemos todo.
        setTimeout(() => {
            setLoadingButton(false);
        }, 3000);

    };

    const [accordions2, setAccordions2] = useState<Record<string, Addon[]>>({});

    const [formData, setFormData] = useState({
        category: '0',
        subCategory: '0',
        service: '0',
        addon: '0',
        unitType: '0',
        amount: 1,
        addonPrice: 100,
    });
    const [formErrors, setFormErrors] = useState({
        category: false,
        subCategory: false,
        service: false,
        addon: false,
        unitType: false,
        amount: false,
    });

    const updateField = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        if (field in formErrors) {
            const isError =
                typeof value === 'string' ? value === '0' :
                    typeof value === 'number' ? value < 0.1 :
                        false;

            setFormErrors(prev => ({
                ...prev,
                [field]: isError,
            }));
        }
    };

    const handleAddAddon2 = () => {
        const requiredFields = ['category', 'subCategory', 'service', 'addon', 'unitType','amount'];
        const newErrors: Record<string, boolean> = {};

        let hasError = false;
        requiredFields.forEach(field => {
            const value = formData[field as keyof typeof formData];
            if (!value || value === '0') {
                newErrors[field] = true;
                hasError = true;
            }
        });

        if (hasError) {
            setFormErrors(prev => ({ ...prev, ...newErrors }));
            return;
        }

        const addon: Addon = {
            id: Date.now(),
            nombre: formData.addon,
            price: formData.addonPrice.toString(),
            amount: formData.amount.toString(),
            total: (formData.addonPrice * formData.amount).toString(),
        };

        setAccordions2(prev => ({
            ...prev,
            [formData.service]: prev[formData.service]
                ? [...prev[formData.service], addon]
                : [addon],
        }));
    };
    const handleAmountChange = (e: { target: { value: string } }) => {
        updateField('amount', Number(e.target.value));
    };

    const deleteAddon = (key: string, addonId: number) => {
        setAccordions2(prev => ({
            ...prev,
            [key]: prev[key].filter(a => a.id !== addonId)
        }));
    };


    useEffect(() => {
        const fetchRequests = async () => {
            try {

                const response = await fetch(urlEndpoint, {
                    headers: { 'Content-Type': 'application/json',},
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                setRequests(data);

                setLoading(false);
            } catch (e:any) {
                setError(e);
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) {
        return <p>Loading requests...</p>;
    }

    if (error) {
        return <p>Error fetching requests: {error}</p>;
    }


    return (
        <Modal
            open={open}
            onClose={ () => {setClose(true)} }
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >

            <ModalDialog  sx={{
      width: 1200, // Ancho deseado en píxeles
      maxWidth: '90%', // Ancho máximo para responsividad
      height: 400, // Alto deseado en píxeles
      maxHeight: '80%', // Alto máximo
    }}>
                <form
                    onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        setClose(true);
                    }}
                >
                <ModalClose onClick={() => {setClose(true)}} />
                <Box
                    sx={{
                        flexGrow: 1,
                        m: -3,
                        p: 4,
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                        bgcolor: `${'var(--colors-index)'}.500`,
                    }}
                    style={{ '--colors-index': colors[index] } as any}
                >
                    <Tabs
                        size="lg"
                        aria-label="Bottom Navigation"
                        value={index}
                        onChange={(event, value) => setIndex(value as number)}
                        sx={(theme) => ({
                            p: 1,
                            borderRadius: 16,
                            maxWidth: '90%',
                            mx: 'auto',
                            boxShadow: theme.shadow.sm,
                            '--joy-shadowChannel': theme.vars.palette[colors[index]].darkChannel,
                            [`& .${tabClasses.root}`]: {
                                py: 1,
                                flex: 1,
                                transition: '0.3s',
                                fontWeight: 'md',
                                fontSize: 'md',
                                [`&:not(.${tabClasses.selected}):not(:hover)`]: {
                                    opacity: 0.7,
                                },
                            },
                        })}
                    >
                        <TabList  variant="plain" size="sm"  disableUnderline  sx={{ borderRadius: 'lg', p: 0 }} >
    <Tab disableIndicator orientation="vertical"  {...(index === 0 && { color: colors[0] })} >
                                <ListItemDecorator>
                                    <PersonIcon />
                                </ListItemDecorator>
                                Basic Request Info
    </Tab>
    <Tab  disableIndicator orientation="vertical" {...(index === 1 && { color: colors[1] })}  >
                                <ListItemDecorator>
                                    <ChecklistSharpIcon />
                                </ListItemDecorator>
                                Request Service's Details
    </Tab>
    <Tab    disableIndicator orientation="vertical"  {...(index === 2 && { color: colors[2] })}   >
                                <ListItemDecorator>
                                    <AssignmentTurnedInSharpIcon />
                                </ListItemDecorator>
                                Summary
    </Tab>

                        </TabList>

                        <Box  sx={(theme) => ({
                                '--bg': theme.vars.palette.background.surface,
                                background: 'var(--bg)',
                                boxShadow: '0 0 0 100vmax var(--bg)',
                                clipPath: 'inset(0 -100vmax)',

                            })} >
    <TabPanel value={0} >
                                <div className=" place-content-center flex pt-8">
                                    <AccordionGroup
                                        sx={{
                                            maxWidth: "100%",
                                            [`& .${accordionSummaryClasses.indicator}`]: {
                                                transition: '0.3s',
                                            },
                                            [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                                                transform: 'rotate(45deg)',
                                            },
                                        }}
                                        transition={{
                                            initial: "0.3s ease-out",
                                            expanded: "0.2s ease",
                                        }}
                                    >
                                        <Accordion
                                           defaultExpanded
                                        >
                                            <AccordionSummary indicator={<AddIcon />} className="bg-blue-300 "
                                                              sx={{ borderRadius: '0.75rem' , color: 'white', marginY: '10px' }}
                                            >
                                                User Info
                                            </AccordionSummary>
                                            <AccordionDetails >

                                                <div className="ml-12 mt-4 flex flex-nowrap gap-4 md:flex-wrap sm:flex-wrap">
                                                    <IconButton
                                                        disabled={ typeForm=='new' }
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() =>{


                                                        }}

                                                        size="sm"
                                                    >
                                                        <Search />
                                                    </IconButton>
                                                    <Avatar alt="userName" src="images/avatar1.jpg" size="lg" variant="outlined" />

                                                    <Typography id="labelPersonName"
                                                        level="h4"
                                                        sx={{ alignSelf:'center' }}
                                                    >
                                                        Franklin Luis Parra
                                                        {'   |   '}
                                                    </Typography>

                                                    <Typography id="labelPersonPhone"
                                                        level="h4"
                                                        sx={{ alignSelf:'center' }}
                                                    >
                                                        +58 424 123 456 789
                                                        {'   |   '}
                                                    </Typography>

                                                    <Typography id="labelPersonEmail"
                                                        level="h4"
                                                        sx={{ alignSelf:'center' }}
                                                    >
                                                        correoCorporativo@gmail.com

                                                    </Typography>

                                                </div>
                                                <div   className="flex flex-wrap mt-8">


                                                </div>

                                            </AccordionDetails>
                                        </Accordion>
                                <Accordion defaultExpanded>
                                            <AccordionSummary
                                                indicator={<AddIcon />} className="bg-blue-300 "
                                                sx={{ borderRadius: '0.75rem' , marginY: '10px' }}
                                            >
                                                <Typography className="text-white">
                                                   Location's Request Info
                                                </Typography>

                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div className="mx-auto mt-4 mb-8 flex flex-nowrap space-x-8

                                                 "
                                                >

                                                    <SelectJoy
                                                        rows={rows}
                                                        width={240}
                                                        idName={"Country"}
                                                        placeholder={"Select a Country"}
                                                        defaultValue={"1"}
                                                    />
                                                    <SelectJoy
                                                        rows={rows}
                                                        width={240}
                                                        idName={"State"}
                                                        placeholder={"Select a State"}
                                                        defaultValue={""}
                                                    />
                                                    <SelectJoy
                                                        rows={rows}
                                                        width={240}
                                                        idName={"Locality"}
                                                        placeholder={"Select a Locality"}
                                                        defaultValue={""}
                                                    />

                                                </div>
                                                Aqui va el googleMap
                                            </AccordionDetails>
                                </Accordion>

                                    </AccordionGroup>

                                </div>

    </TabPanel>
          <TabPanel value={1}>
                                <div className="  place-content-center mt-4">
                                    <div className="flex flex-nowrap space-x-4 place-content-center">
                                        <SelectJoy
                                            rows={rows}
                                            width={240}
                                            idName={"Country"}
                                            placeholder={"Select a Category"}
                                            defaultValue={""}
                                            hasError={formErrors.category}
                                            onChange={(e: any, value: string | null) => {
                                                if (value) updateField('category',value);
                                            }}

                                        />
                                        <SelectJoy
                                            rows={rows}
                                            width={240}
                                            idName={"Country"}
                                            placeholder={"Select a Sub Category"}
                                            defaultValue={""}
                                            hasError={formErrors.subCategory}
                                            onChange={(e: any, value: string | null) => {
                                                if (value) updateField('subCategory',value);
                                            }}
                                        />
                                        <SelectJoy
                                            rows={rows}
                                            width={240}
                                            idName="service"
                                            placeholder="Select a Service"
                                            defaultValue=""
                                            hasError={formErrors.service}
                                            onChange={(e: any, value: string | null) => {
                                                if (value) updateField('service',value);
                                            }}
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-nowrap space-x-4 place-content-center">
                                        <SelectJoy
                                            rows={rows}
                                            width={200}
                                            idName="addon"
                                            placeholder="Select an Addon"
                                            defaultValue=""
                                            hasError={formErrors.addon}
                                            onChange={(e: any, value: string | null) => {
                                                if (value) updateField('addon',value);
                                            }}
                                        />
                                        <SelectJoy
                                            rows={rows}
                                            width={180}
                                            idName="unit"
                                            placeholder="Select unit type"
                                            defaultValue=""
                                            hasError={formErrors.unitType}
                                            onChange={(e: any, value: string | null) => {
                                                if (value) updateField('unitType',value);
                                            }}
                                        />
                                        <InputNumber
                                            idName="amount"
                                            prefix="$"
                                            name="amount"
                                            placerHolder="Amount"
                                            hasError={formErrors.amount}
                                            onChange={handleAmountChange}
                                            width={80}
                                        />
                                        <IconButton
                                            disabled={ typeForm=='new' }
                                            variant="outlined"
                                            color="primary"
                                            onClick={ /*handleAddAddon*/
                                                () => {
                                                    handleAddAddon2()
                                                }
                                        }
                                            size="sm"
                                        >
                                            <AddSharpIcon />
                                        </IconButton>

                                    </div>
                                    <div className="mb-4 mt-8">
                                        <Divider >
                                            <Chip  icon={ <LoupeSharpIcon /> } color="success"
                                                label="Services Added" size="medium" variant="outlined"
                                            />
                                        </Divider>
                                    </div>


                                    <div id="servicesContainer"
                                        className="mt-8 grid grid-cols-2 space-x-3 "
                                    >


                                        {Object.entries(accordions2).map(([key, addons]) => (
                                            <AccordionGroup key={key}>
                                                <Accordion defaultExpanded>
                                                    <AccordionSummary indicator={<AddIcon />} className="bg-blue-300 text-green-950 rounded ">
                                                        {key}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
                                                            {addons.map(addon => (
                                                                <AddonCard
                                                                    key={addon.id}
                                                                    nombre={addon.nombre}
                                                                    price={addon.price}
                                                                    amount={addon.amount}
                                                                    total={addon.total}
                                                                    onDelete={() => deleteAddon(key, addon.id)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </AccordionGroup>
                                        ))}

                                    </div>

                                </div>
          </TabPanel>
          <TabPanel value={2}>
              <Typography level="h4" sx={{ mb: 2 ,textAlign:'center'}}>
                  Summary
              </Typography>

              <Box
                  sx={{
                      maxHeight: 400, // o la altura que necesites
                      overflowY: 'auto',
                      pr: 1, // opcional: padding para que no se corte el contenido
                  }}
              >
                  {Object.entries(accordions2).map(([serviceName, addons]) => (
                      <SummaryCard key={serviceName} serviceName={serviceName} addons={addons} />
                  ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography  textAlign="right">
                  Grand Total:{' '}
                  <strong>
                      $
                      {Object.values(accordions2)
                          .flat()
                          .reduce((sum, addon) => sum + Number(addon.total), 0)
                          .toFixed(2)}
                  </strong>
              </Typography>
              <div className="flex place-content-center">
                  <Button

                      color="success"
                      startDecorator={!loadingButton && <CheckIcon />}
                      disabled={loadingButton}
                      onClick={handleClickFinalizar}
                      endDecorator={
                          loadingButton && <CircularProgress size="sm" color="neutral" variant="plain" />
                      }
                  >
                      {loadingButton ? 'Procesando...' : 'Finalizar'}
                  </Button>
              </div>
          </TabPanel>
                        </Box>
                    </Tabs>

                </Box>
                </form>
            </ModalDialog>

        </Modal>


    );


}

const rows = [
    { key: "USA" , value: "USA"},
    { key: "Rojo" , value: "Rojo"},
    { key: "Zapato" , value: "Zapato"},
]
const rows2 = [
    { label: "hola mundo" , value: "hola mundo"},
    { label: "mundo hello" , value: "mundo hello"},
    { label: "hello world" , value: "hello world"},
]

interface typeFormx {
    type : "view" | "edit" | "new";
}




const StyledInput = styled(Input)( ({ theme }) => `

  .${inputClasses.input} {
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  }
`,);

const Label = styled(   ({ children, className }: { children?: React.ReactNode; className?: string }) => {

        const formControlContext = useFormControlContext();
        const [dirty, setDirty] = React.useState(false);

        React.useEffect(() => {
            if (formControlContext?.filled) {
                setDirty(true);
            }
        }, [formControlContext]);

        if (formControlContext === undefined) {
            return <p>{children}</p>;
        }

        const { error, required, filled } = formControlContext;
        const showRequiredError = dirty && required && !filled;

        return (
            <p className={clsx(className, error || showRequiredError ? 'invalid' : '')}>
                {children}
                {required ? ' *' : ''}
            </p>
        );
    },)`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  margin-bottom: 4px;

  &.invalid {
    color: red;
  }
`;

const HelperText = styled((props: {}) => {
    const formControlContext = useFormControlContext();
    const [dirty, setDirty] = React.useState(false);

    React.useEffect(() => {
        if (formControlContext?.filled) {
            setDirty(true);
        }
    }, [formControlContext]);

    if (formControlContext === undefined) {
        return null;
    }

    const { required, filled } = formControlContext;
    const showRequiredError = dirty && required && !filled;

    return showRequiredError ? <p {...props}>This field is required.</p> : null;
})`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

export default RequestForm;